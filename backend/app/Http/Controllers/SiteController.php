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

            // Проверка существования README.md
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

        /**
         * Страница из базы данных
         */
        $page = Page::where('code', $code)
            ->where('is_active', true)
            ->firstOrFail();

        // Определение формата контента
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
        /**
         * Явные markdown-маркеры
         */
        if (
            str_contains($content, '[md]') ||
            str_contains($content, '```') ||
            preg_match('/^# /m', $content)
        ) {
            return 'markdown';
        }

        /**
         * HTML-контент
         */
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
        // Замена frontend/public/images/screenshots/ на images/screenshots/
        $pattern = '#frontend/public(/images/screenshots/[^)\s]+)#';
        $replacement = '$1';
        $content = preg_replace($pattern, $replacement, $content);

        $content = str_replace('\\', '/', $content);

        $html = Str::markdown($content);

        return '<article class="markdown-body">' . $html . '</article>';
    }

    /**
     * Возвращает ключ ограничения частоты отправки формы контакта.
     * Используется Laravel RateLimiter и IP пользователя.
     */
    protected function contactRetryAfter(Request $request): int
    {
        return RateLimiter::availableIn($request->ip());
    }

    /**
     * Отправка формы обратной связи
     */
    public function sendContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Contact::create($validated);

        return $this->success([
            'message' => 'Ваше сообщение успешно отправлено.',
            'retry_after' => $this->contactRetryAfter($request),
        ]);
    }

}
