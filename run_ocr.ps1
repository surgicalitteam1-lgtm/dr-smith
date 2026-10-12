param(
    [string[]]$Dirs = @(
        'catalogue\suction-machine',
        'catalogue\revolving-stool',
        'catalogue\instruments-set',
        'catalogue\surgical-instruments',
        'catalogue\delivery-table',
        'catalogue\ventilators',
        'catalogue\patient-monitor'
    )
)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime]
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod 
} | Select-Object -First 1

function Await-WinRT($winRtAsyncOp, [type]$resultType) {
    $task = $asTaskGeneric.MakeGenericMethod($resultType).Invoke($null, @($winRtAsyncOp))
    $task.Wait()
    return $task.Result
}

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

foreach ($d in $Dirs) {
    if (Test-Path $d) {
        $files = Get-ChildItem -Path $d -Filter '*.png'
        foreach ($f in $files) {
            try {
                $file = Await-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)) ([Windows.Storage.StorageFile])
                $stream = Await-WinRT ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
                $decoder = Await-WinRT ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
                $bitmap = Await-WinRT ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
                $res = Await-WinRT ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
                $cleanText = $res.Text -replace "`r?`n", " | "
                Write-Output "$($f.FullName) ===> $cleanText"
            } catch {
                Write-Output "$($f.FullName) ===> ERROR: $_"
            }
        }
    }
}
