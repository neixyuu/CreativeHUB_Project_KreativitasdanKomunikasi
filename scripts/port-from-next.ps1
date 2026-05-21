$src = "E:\Kuliah\Kreativitas dan Komunikasi\Project-Aktivitas-dan-Komunikasi"
$dst = "E:\Kuliah\Kreativitas dan Komunikasi\CreativeHUB_Proj\CreativeHUB"

function Convert-TsxContent([string]$content) {
    $content = $content -replace "(?m)^['\`"]use client['\`"]\r?\n", ''
    $content = $content -replace 'import Link from "next/link"', "import { Link } from '@inertiajs/react'"
    $content = $content -replace "import Link from 'next/link'", "import { Link } from '@inertiajs/react'"
    $content = $content -replace 'import \{ usePathname \} from "next/navigation"', "import { usePage } from '@inertiajs/react'"
    $content = $content -replace "import \{ usePathname \} from 'next/navigation'", "import { usePage } from '@inertiajs/react'"
    $content = $content -replace 'const pathname = usePathname\(\)', 'const { url } = usePage(); const pathname = url'
    $content = $content -replace 'import \{ useRouter \} from "next/navigation"', "import { router } from '@inertiajs/react'"
    $content = $content -replace 'const router = useRouter\(\)', ''
    $content = $content -replace 'router\.push\(', 'router.visit('
    $content = $content -replace 'window\.location\.href = "([^"]+)"', 'router.visit("$1")'
    $content = $content -replace "window\.location\.href = '([^']+)'", "router.visit('`$1')"
    return $content
}

function Write-ConvertedFile($sourcePath, $destPath) {
    $dir = Split-Path $destPath -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $content = Get-Content -LiteralPath $sourcePath -Raw -Encoding UTF8
    $content = Convert-TsxContent $content
    [System.IO.File]::WriteAllText($destPath, $content, [System.Text.UTF8Encoding]::new($false))
}

# UI components
$uiComponents = @('tabs', 'progress', 'textarea', 'switch', 'slider', 'scroll-area')
foreach ($c in $uiComponents) {
    $sp = Join-Path $src "components\ui\$c.tsx"
    if (Test-Path $sp) {
        Write-ConvertedFile $sp (Join-Path $dst "resources\js\components\ui\$c.tsx")
    }
}

# Landing components
$landing = @('navbar', 'hero', 'categories', 'featured-creators', 'footer')
foreach ($c in $landing) {
    Write-ConvertedFile (Join-Path $src "components\landing\$c.tsx") (Join-Path $dst "resources\js\components\landing\$c.tsx")
}

# Hub layout components
Write-ConvertedFile (Join-Path $src "components\dashboard\sidebar.tsx") (Join-Path $dst "resources\js\components\hub\dashboard-sidebar.tsx")
Write-ConvertedFile (Join-Path $src "components\dashboard\header.tsx") (Join-Path $dst "resources\js\components\hub\dashboard-header.tsx")
Write-ConvertedFile (Join-Path $src "components\creator\sidebar.tsx") (Join-Path $dst "resources\js\components\hub\creator-sidebar.tsx")

# Pages mapping
$pageMap = @{
    'app\page.tsx' = 'resources\js\pages\home.tsx'
    'app\(dashboard)\explore\page.tsx' = 'resources\js\pages\hub\explore.tsx'
    'app\(dashboard)\dashboard\page.tsx' = 'resources\js\pages\hub\dashboard.tsx'
    'app\(dashboard)\dashboard\profile\page.tsx' = 'resources\js\pages\hub\profile.tsx'
    'app\(dashboard)\dashboard\settings\page.tsx' = 'resources\js\pages\hub\settings.tsx'
    'app\(dashboard)\dashboard\messages\page.tsx' = 'resources\js\pages\hub\messages.tsx'
    'app\(dashboard)\dashboard\commissions\page.tsx' = 'resources\js\pages\hub\commissions.tsx'
    'app\(dashboard)\dashboard\favorites\page.tsx' = 'resources\js\pages\hub\favorites.tsx'
    'app\(dashboard)\commission\create\page.tsx' = 'resources\js\pages\hub\commission-create.tsx'
    'app\(creator)\creator\dashboard\page.tsx' = 'resources\js\pages\creator\dashboard.tsx'
    'app\(creator)\creator\portfolio\page.tsx' = 'resources\js\pages\creator\portfolio.tsx'
}

foreach ($entry in $pageMap.GetEnumerator()) {
    $sp = Join-Path $src $entry.Key
    $dp = Join-Path $dst $entry.Value
    if (Test-Path -LiteralPath $sp) {
        Write-ConvertedFile $sp $dp
        Write-Host "OK: $($entry.Value)"
    } else {
        Write-Host "MISS: $($entry.Key)"
    }
}

# Creator profile dynamic page
$creatorProfile = Join-Path $src 'app\(dashboard)\creator\[username]\page.tsx'
if (Test-Path -LiteralPath $creatorProfile) {
    $dest = Join-Path $dst 'resources\js\pages\hub\creator-profile.tsx'
    $content = Get-Content -LiteralPath $creatorProfile -Raw -Encoding UTF8
    $content = Convert-TsxContent $content
    $content = $content -replace 'export default function \w+', 'export default function CreatorProfile'
    if ($content -notmatch 'username') {
        $content = $content -replace 'export default function CreatorProfile\(\)', @'
import { usePage } from '@inertiajs/react'

type Props = { username: string }

export default function CreatorProfile({ username }: Props)
'@
    }
    [System.IO.File]::WriteAllText($dest, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "OK: hub/creator-profile.tsx"
}

Write-Host "Done."
