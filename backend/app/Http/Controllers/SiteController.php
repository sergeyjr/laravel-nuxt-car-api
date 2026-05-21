<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class SiteController extends Controller
{

    /**
     * Получение страницы сайта
     */
    public function page(string $code): JsonResponse
    {
        /**
         * Страница README.md
         */
        if ($code === 'about') {
            $projectRoot = dirname(base_path());
            $readmePath = $projectRoot . '/README.md';

            if (!file_exists($readmePath)) {
                abort(404, 'Файл README.md не найден.');
            }

            $markdown = file_get_contents($readmePath);

            return $this->success([
                'code' => 'about',
                'title' => 'О проекте',
                'content' => $this->renderContent($markdown, 'markdown'),
                'format' => 'markdown',
                'is_active' => true,
            ]);
        }

        $page = Page::query()
            ->where('code', $code)
            ->where('is_active', true)
            ->firstOrFail();

        $format = $page->format ?? $this->detectFormat($page->content);

        return $this->success([
            ...$page->toArray(),
            'format' => $format,
            'content' => $this->renderContent($page->content, $format),
        ]);
    }

    /**
     * Определение формата контента
     */
    protected function detectFormat(string $content): string
    {
        if (
            str_contains($content, '[md]') ||
            str_contains($content, '```') ||
            preg_match('/^# /m', $content)
        ) {
            return 'markdown';
        }

        if ($content !== strip_tags($content)) {
            return 'html';
        }

        return 'text';
    }

    /**
     * Рендеринг контента
     */
    protected function renderContent(string $content, string $format): string
    {
        $content = str_replace(['[md]', '[/md]'], '', $content);

        return match ($format) {
            'markdown' => $this->renderMarkdown($content),
            'html' => $content,
            default => nl2br(e($content)),
        };
    }

    /**
     * Рендеринг контента
     */
    protected function renderMarkdown(string $content): string
    {
        $pattern = '#frontend/public(/images/screenshots/[^)\s]+)#';
        $replacement = '$1';
        $content = preg_replace($pattern, $replacement, $content);

        $content = str_replace('\\', '/', $content);

        $html = Str::markdown($content);

        return '<article class="markdown-body">' . $html . '</article>';
    }

    /**
     * Ключ ограничения частоты отправки формы контакта
     */
    protected function contactThrottleKey(Request $request): string
    {
        return 'contact:' . $request->ip();
    }

    /**
     * Возвращает время до следующей попытки отправки формы контакта
     */
    protected function contactRetryAfter(Request $request): int
    {
        return RateLimiter::availableIn($this->contactThrottleKey($request));
    }

    /**
     * Отправка формы обратной связи
     */
    public function sendContact(Request $request): JsonResponse
    {
        $key = $this->contactThrottleKey($request);

        if (RateLimiter::tooManyAttempts($key, 1)) {
            return $this->error(
                'contact.tooManyRequests',
                429,
                [
                    'retry_after' => $this->contactRetryAfter($request),
                ]
            );
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Contact::create($validated);

        RateLimiter::hit($key, 60);

        return $this->success([
            'message' => 'contact.sent',
            'retry_after' => $this->contactRetryAfter($request),
        ]);
    }

}
