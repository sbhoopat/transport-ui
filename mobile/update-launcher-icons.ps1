# Script to update all Android launcher icons with icon.png
$iconPath = "assets\icon.png"
$resPath = "android\app\src\main\res"

$folders = @("mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi")

foreach ($folder in $folders) {
    $folderPath = Join-Path $resPath $folder
    
    # Update ic_launcher.png
    $launcherPath = Join-Path $folderPath "ic_launcher.png"
    if (Test-Path $launcherPath) {
        Copy-Item -Path $iconPath -Destination $launcherPath -Force
        Write-Host "Updated: $launcherPath"
    }
    
    # Update ic_launcher_round.png
    $roundPath = Join-Path $folderPath "ic_launcher_round.png"
    if (Test-Path $roundPath) {
        Copy-Item -Path $iconPath -Destination $roundPath -Force
        Write-Host "Updated: $roundPath"
    }
}

Write-Host "`nAll launcher icons have been updated!"

