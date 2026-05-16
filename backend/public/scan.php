<?php

/**
 * Генератор структуры проекта в Markdown
 * Подходит для Laravel + Nuxt проектов
 */

class ProjectTreeGenerator
{
    private string $rootPath;
    private array $excludePaths;
    private bool $showFiles;

    public function __construct(array $config = [])
    {
        $this->rootPath = rtrim($config['root_path'] ?? __DIR__, DIRECTORY_SEPARATOR);

        $this->excludePaths = array_map(
            fn($path) => trim(str_replace('\\', '/', $path), '/'),
            $config['exclude'] ?? []
        );

        $this->showFiles = $config['show_files'] ?? true;
    }

    public function generate(): string
    {
        $tree = "# Project Structure\n\n";
        $tree .= "```text\n";
        $tree .= basename($this->rootPath) . "/\n";
        $tree .= $this->scan($this->rootPath);
        $tree .= "```\n";

        return $tree;
    }

    public function save(string $content, string $path): void
    {
        $dir = dirname($path);

        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        file_put_contents($path, $content);
    }

    private function scan(string $directory, string $prefix = ''): string
    {
        $output = '';

        $items = scandir($directory);

        if ($items === false) {
            return $output;
        }

        $items = array_values(array_diff($items, ['.', '..']));

        usort($items, function ($a, $b) use ($directory) {
            $pathA = $directory . DIRECTORY_SEPARATOR . $a;
            $pathB = $directory . DIRECTORY_SEPARATOR . $b;

            if (is_dir($pathA) && !is_dir($pathB)) {
                return -1;
            }

            if (!is_dir($pathA) && is_dir($pathB)) {
                return 1;
            }

            return strcmp($a, $b);
        });

        $count = count($items);

        foreach ($items as $index => $item) {
            $fullPath = $directory . DIRECTORY_SEPARATOR . $item;

            $relativePath = trim(str_replace(
                str_replace('\\', '/', $this->rootPath),
                '',
                str_replace('\\', '/', $fullPath)
            ), '/');

            if ($this->isExcluded($relativePath)) {
                continue;
            }

            $isLast = ($index === $count - 1);

            $connector = $isLast ? '└── ' : '├── ';
            $nextPrefix = $prefix . ($isLast ? '    ' : '│   ');

            if (is_dir($fullPath)) {
                $output .= $prefix . $connector . $item . "/\n";
                $output .= $this->scan($fullPath, $nextPrefix);
            } else {
                if ($this->showFiles) {
                    $output .= $prefix . $connector . $item . "\n";
                }
            }
        }

        return $output;
    }

    private function isExcluded(string $relativePath): bool
    {
        $normalizedPath = trim(str_replace('\\', '/', $relativePath), '/');
        $segments = explode('/', $normalizedPath);

        foreach ($this->excludePaths as $exclude) {
            $exclude = trim($exclude, '/');

            if (!str_contains($exclude, '/')) {
                if (in_array($exclude, $segments, true)) {
                    return true;
                }
                continue;
            }

            if (
                $normalizedPath === $exclude ||
                str_starts_with($normalizedPath, $exclude . '/')
            ) {
                return true;
            }
        }

        return false;
    }
}

/*
|--------------------------------------------------------------------------
| Настройки
|--------------------------------------------------------------------------
*/

$config = [

    'root_path' => dirname(dirname(__DIR__)),

    'exclude' => [
        '.git',
        '.idea',
        '.nuxt',
        '.vscode',
        'backend/public/build',
        'backend/public/storage/avatars',
        'docs',
        'node_modules',
        'screenshots',
        'storage',
        'vendor',
    ],

    'show_files' => true,
];

/*
|--------------------------------------------------------------------------
| Запуск
|--------------------------------------------------------------------------
*/

$generator = new ProjectTreeGenerator($config);

$content = $generator->generate();

/**
 * путь к файлу docs/tree.md
 * (2 уровня вверх от текущего файла)
 */
$outputPath = dirname(__DIR__, 2) . '/docs/tree.md';

$generator->save($content, $outputPath);

header('Content-Type: text/plain; charset=utf-8');

echo $content;
