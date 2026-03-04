$dir = "images"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir }

$images = @(
    @{ url = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"; filename = "hero-bg.jpg" },
    @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=r1"; filename = "r1.svg" },
    @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=r2"; filename = "r2.svg" },
    @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=r3"; filename = "r3.svg" },
    @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=r4"; filename = "r4.svg" },
    @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager"; filename = "Manager.svg" }
)

$seeds = "Анастасия Курчева", "Елена Соколова", "Руслан Хабибуллин", "Виктория Ким", "Мария С.", "Иван К.", "Сергей П.", "Анна В.", "Лилия М.", "Тимур Г.", "Олег Б.", "Нина Д."

foreach ($seed in $seeds) {
    $encoded = [uri]::EscapeDataString($seed)
    $images += @{ url = "https://api.dicebear.com/7.x/avataaars/svg?seed=$encoded"; filename = "$seed.svg" }
}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
foreach ($img in $images) {
    $dest = Join-Path $dir $img.filename
    Invoke-WebRequest -Uri $img.url -OutFile $dest
    Write-Host "Downloaded $($img.filename)"
}
