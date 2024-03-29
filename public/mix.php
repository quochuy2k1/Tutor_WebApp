<?php

use Helpers\Util;

require_once(__DIR__ . "../../helpers/utilities.php");

if (!function_exists('mix')) {
    /**
     * Get the path to a versioned Mix file.
     *
     * @param string $path
     * @param string $manifestDirectory
     * @return string
     *
     * @throws \Exception
     */
    function mix($path, $manifestDirectory = '')
    {
        static $manifest;
        $publicFolder = '/public';
        $rootPath = $_SERVER['DOCUMENT_ROOT'];
        // echo $rootPath;
        $publicPath = $rootPath . $publicFolder;
        if ($manifestDirectory && !str_starts_with($manifestDirectory, '/')) {
            $manifestDirectory = "/{$manifestDirectory}";
        }

        if (!$manifest) {
            if (!file_exists($manifestPath = ($rootPath . $manifestDirectory . '/mix-manifest.json'))) {
                throw new Exception('The Mix manifest does not exist.');
            }
            $manifest = json_decode(file_get_contents($manifestPath), true);
        }
        if (!str_starts_with($path, '/')) {
            $path = "/{$path}";
        }
        // if(!str_contains($path, "admin"))
        //     $path = $publicFolder . $path;
        if (!array_key_exists($path, $manifest)) {
            throw new Exception(
                "Unable to locate Mix file: {$path}. Please check your " .
                    'webpack.mix.js output paths and try again.'
            );
        }
        return file_exists($publicPath . ($manifestDirectory . '/hot'))
            ? Util::getRootURL() . "$manifest[$path]}"
            : $manifestDirectory . $manifest[$path];
    }
}
