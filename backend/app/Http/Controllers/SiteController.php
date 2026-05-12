<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SiteController extends Controller
{

    public function home(): JsonResponse
    {
        return response()->json([
            'message' => 'Главная страница'
        ]);
    }

    public function page(string $code): JsonResponse
    {
        /**
         * README.md page
         */
        if ($code === 'about') {

            $projectRoot = dirname(base_path());
            $readmePath = $projectRoot . '/README.md';

            if (!file_exists($readmePath)) {
                abort(404, 'README.md not found');
            }

            $markdown = file_get_contents($readmePath);

            return response()->json([
                'code' => 'about',
                'title' => 'About',
                'content' => $this->renderContent($markdown, 'markdown'),
                'format' => 'markdown',
                'is_active' => true,
            ]);
        }

        /**
         * DB page
         */
        $page = Page::where('code', $code)
            ->where('is_active', true)
            ->firstOrFail();

        $format = $page->format ?? $this->detectFormat($page->content);

        return response()->json([
            ...$page->toArray(),
            'format' => $format,
            'content' => $this->renderContent($page->content, $format),
        ]);
    }

    /**
     * Detect content format
     */
    protected function detectFormat(string $content): string
    {
        /**
         * Explicit markdown markers
         */
        if (
            str_contains($content, '[md]') ||
            str_contains($content, '```') ||
            preg_match('/^# /m', $content)
        ) {
            return 'markdown';
        }

        /**
         * HTML
         */
        if ($content !== strip_tags($content)) {
            return 'html';
        }

        return 'text';
    }

    /**
     * Render content
     */
    protected function renderContent(string $content, string $format): string
    {
        /**
         * Remove markdown markers
         */
        $content = str_replace(
            ['[md]', '[/md]'],
            '',
            $content
        );

        return match ($format) {

            'markdown' => '
                <article class="markdown-body">
                    ' . Str::markdown($content) . '
                </article>
            ',

            'html' => $content,

            default => nl2br(e($content)),
        };
    }

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
        ]);
    }

}
