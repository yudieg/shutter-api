<?php

class ShutterApi
{
    protected $routes = [];

    public function __construct($rootPath)
    {


    }
    /**
     * Method setMin
     * @param [type] $min [description]
     */
    public function setMin($min)
    {
        $this->outputJson(['success' => true]);
    }


    public function configureDevice($deviceId, $val)
    {

    }

    /**
     * @OA\get(
     * ) 
     * @param  [type] $deviceId [description]
     * @return [type]           [description]
     */
    public function getDeviceConfig($deviceId)
    {
        try {
            $filename = $this->getDeviceConfigFilename($deviceId);
            if (!file_exists($filename)) {
                throw new \Exception("Unable to get device configuration");
            }
            $configJson = file_get_contents($filename);
            $config = json_decode($configJson);
            if (empty($config)) {
                throw new \Exception("JSON error " . json_last_error());
            }
            return $config;
        } catch (\Exception $e) {
            $this->outputJson(['error' => $e->getMessage()]);
            exit;
        }
    }

    public function saveCalibration($deviceId)
    {
        $minPos = isset($_POST['minPos']) ? $_POST['minPos'] : 0;
        $maxPos = isset($_POST['maxPos']) ? $_POST['maxPos'] : 0;
        $startPos = isset($_POST['startPos']) ? $_POST['startPos'] : 0;
        $config = $this->getDeviceConfig($deviceId);
        $config->calibration  = [
            "min" => (int)$minPos,
            "max" => (int)$maxPos,
            "start" => (int)$startPos,
        ];
        $filename = $this->getDeviceConfigFilename($deviceId);
        if (!file_exists($filename)) {
            return ['error' => 'config file does not exists'];
        }

        file_put_contents($filename, json_encode($config));
        
        return ['success' => true,  'config' => $config];
    }

    protected function getDeviceConfigFilename($deviceId)
    {
        return dirname(__FILE__) . '/devices/device-'. $deviceId . '.json';
    }


    public function route($path = null)
    {
        if ($path === null) {
            $path = $this->getRequestPath();
        }

        list($method, $params) = $this->getMethodParamsFromPath($path);

        $response = [
            'path' => $path,
            'method' => $method,
            'params' => $params,
        ];

        if (!method_exists($this, $method)) {
            $this->outputJson(['error' => 'Method ' . $method . ' not available']);
        }

        $ret = call_user_func_array([$this, $method], $params);
        $this->outputJson($ret);
    }



    protected function outputJson($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function getMethodParamsFromPath($path)
    {
        $chunks = explode('/', $path);
        $method = array_shift($chunks);

        //if (method_exists($this, $method)) {
            return [$method, $chunks];
        //}

        return [null, null];
    }

    public function getRequestPath()
    {
        $url = $_SERVER['REQUEST_URI'];

        $parsedUrl = parse_url($url);

        $path = $parsedUrl['path'];

        $path = explode('/', $path);
        $path = array_filter($path);
        array_shift($path);

        return implode('/', $path);
    }
}