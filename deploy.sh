#!/bin/bash

# ==============================================================================
# UNIVERSAL GITHUB DEPLOY v3.0
#
# Git + GitHub + Tag + Release + GitHub Pages + Student Links
#
# Usage:
#   ./deploy.sh
#   ./deploy.sh v1.0.0
#
# First time:
#   chmod +x deploy.sh
#
# ==============================================================================

set -e

echo ""
echo "============================================================"
echo "        🚀 UNIVERSAL GITHUB DEPLOY v3.0"
echo "============================================================"
echo ""

# ============================================================
# 1. CHECK GIT
# ============================================================

if ! command -v git >/dev/null 2>&1; then
    echo "❌ Không tìm thấy Git."
    exit 1
fi

echo "✅ Git: $(git --version)"

# ============================================================
# 2. CHECK GITHUB CLI
# ============================================================

if ! command -v gh >/dev/null 2>&1; then

    echo "❌ Chưa cài GitHub CLI (gh)."
    echo ""
    echo "Cài bằng:"
    echo "  brew install gh"
    echo ""
    exit 1

fi

echo "✅ GitHub CLI: $(gh --version | head -n 1)"

# ============================================================
# 3. CHECK GITHUB LOGIN
# ============================================================

if ! gh auth status >/dev/null 2>&1; then

    echo "❌ GitHub CLI chưa đăng nhập."
    echo ""
    echo "Chạy:"
    echo "  gh auth login"
    echo ""

    exit 1

fi

echo "✅ GitHub CLI đã đăng nhập."

# ============================================================
# 4. CHECK INDEX.HTML
# ============================================================

if [ ! -f "index.html" ]; then

    echo ""
    echo "❌ Không tìm thấy index.html"
    echo ""
    echo "Hãy chạy deploy.sh trong thư mục project."
    echo ""

    exit 1

fi

echo "✅ Tìm thấy index.html."

# ============================================================
# 5. PROJECT INFORMATION
# ============================================================

GITHUB_USER="$(gh api user --jq '.login')"
REPO_NAME="$(basename "$PWD")"

OWNER_REPO="${GITHUB_USER}/${REPO_NAME}"

REPO_URL="https://github.com/${OWNER_REPO}"

APP_URL="https://${GITHUB_USER}.github.io/${REPO_NAME}/"

FORK_URL="${REPO_URL}/fork"

RELEASES_URL="${REPO_URL}/releases"

ACTIONS_URL="${REPO_URL}/actions"

PAGES_SETTINGS_URL="${REPO_URL}/settings/pages"

ISSUES_URL="${REPO_URL}/issues"

README_URL="${REPO_URL}#readme"

ZIP_URL="${REPO_URL}/archive/refs/heads/main.zip"

CLONE_HTTPS="https://github.com/${OWNER_REPO}.git"

CLONE_SSH="git@github.com:${OWNER_REPO}.git"

echo ""
echo "------------------------------------------------------------"
echo "📋 PROJECT INFORMATION"
echo "------------------------------------------------------------"
echo ""
echo "👤 GitHub User : $GITHUB_USER"
echo "📦 Repository  : $REPO_NAME"
echo "📄 Entry       : index.html"
echo ""

# ============================================================
# 6. CHECK GITHUB REPOSITORY
# ============================================================

if ! gh repo view "$OWNER_REPO" >/dev/null 2>&1; then

    echo "❌ Repository GitHub chưa tồn tại:"
    echo "   $OWNER_REPO"
    echo ""

    echo "Hãy tạo repository trước:"
    echo "$REPO_URL"

    exit 1

fi

echo "✅ Repository GitHub tồn tại."

# ============================================================
# 7. INIT GIT
# ============================================================

if [ ! -d ".git" ]; then

    echo ""
    echo "🔧 Khởi tạo Git..."

    git init

else

    echo "✅ Git repository đã tồn tại."

fi

# ============================================================
# 8. MAIN BRANCH
# ============================================================

git branch -M main

echo "✅ Branch: main"

# ============================================================
# 9. ORIGIN
# ============================================================

if git remote get-url origin >/dev/null 2>&1; then

    CURRENT_REMOTE="$(git remote get-url origin)"

    echo ""
    echo "🔗 Remote hiện tại:"
    echo "   $CURRENT_REMOTE"

    if [ "$CURRENT_REMOTE" != "$CLONE_HTTPS" ]; then

        echo "🔧 Cập nhật origin..."

        git remote set-url origin "$CLONE_HTTPS"

    else

        echo "✅ Origin chính xác."

    fi

else

    echo ""
    echo "🔗 Thêm origin:"
    echo "   $CLONE_HTTPS"

    git remote add origin "$CLONE_HTTPS"

fi

# ============================================================
# 10. FETCH
# ============================================================

echo ""
echo "⬇️ Đồng bộ GitHub..."

git fetch origin --tags >/dev/null 2>&1 || true

# ============================================================
# 11. VERSION
# ============================================================

if [ -n "$1" ]; then

    VERSION="$1"

else

    LATEST_TAG="$(
        git tag --list 'v[0-9]*.[0-9]*.[0-9]*' |
        sed 's/^v//' |
        sort -t. -k1,1n -k2,2n -k3,3n |
        tail -n 1
    )"

    if [ -z "$LATEST_TAG" ]; then

        VERSION="v1.0.0"

    else

        IFS='.' read -r MAJOR MINOR PATCH <<< "$LATEST_TAG"

        PATCH=$((PATCH + 1))

        VERSION="v${MAJOR}.${MINOR}.${PATCH}"

    fi

fi

# ============================================================
# 12. VERSION VALIDATION
# ============================================================

if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then

    echo ""
    echo "❌ Version không hợp lệ: $VERSION"
    echo ""
    echo "Ví dụ:"
    echo "  ./deploy.sh"
    echo "  ./deploy.sh v1.0.0"
    echo "  ./deploy.sh v2.0.0"
    echo ""

    exit 1

fi

echo ""
echo "🏷️ Version: $VERSION"

# ============================================================
# 13. GIT ADD
# ============================================================

echo ""
echo "📦 git add ."

git add .

# ============================================================
# 14. COMMIT
# ============================================================

if ! git diff --cached --quiet; then

    echo ""
    echo "📝 Creating commit..."

    git commit -m "Release ${REPO_NAME} ${VERSION}"

else

    echo ""
    echo "ℹ️ Không có thay đổi mới để commit."

fi

# ============================================================
# 15. PUSH MAIN
# ============================================================

echo ""
echo "⬆️ Push main..."

git push -u origin main

echo "✅ main đã được push."

# ============================================================
# 16. CREATE TAG
# ============================================================

echo ""
echo "🏷️ Kiểm tra tag ${VERSION}..."

if git tag -l "$VERSION" | grep -q "^${VERSION}$"; then

    echo "ℹ️ Tag ${VERSION} đã tồn tại."

else

    git tag -a "$VERSION" -m "${REPO_NAME} ${VERSION}"

    echo "✅ Đã tạo tag ${VERSION}."

fi

# ============================================================
# 17. PUSH TAG
# ============================================================

echo ""
echo "⬆️ Push tag ${VERSION}..."

git push origin "$VERSION"

echo "✅ Tag đã được push."

# ============================================================
# 18. GITHUB RELEASE
# ============================================================

echo ""
echo "📦 GitHub Release..."

if gh release view "$VERSION" \
    --repo "$OWNER_REPO" >/dev/null 2>&1; then

    echo "ℹ️ Release ${VERSION} đã tồn tại."

else

    echo "🚀 Đang tạo Release ${VERSION}..."

    gh release create "$VERSION" \
        --repo "$OWNER_REPO" \
        --title "${REPO_NAME} ${VERSION}" \
        --generate-notes

    echo "✅ Release đã được tạo."

fi

# ============================================================
# 19. GITHUB PAGES
# ============================================================

echo ""
echo "🌐 Kiểm tra GitHub Pages..."

if gh api "repos/${OWNER_REPO}/pages" >/dev/null 2>&1; then

    echo "✅ GitHub Pages đã được bật."

else

    echo ""
    echo "⚠️ GitHub Pages chưa được bật bằng API."
    echo ""
    echo "Hãy mở:"
    echo "$PAGES_SETTINGS_URL"
    echo ""
    echo "và chọn:"
    echo "  Source → GitHub Actions"
    echo ""

fi

# ============================================================
# 20. CHECK ACTIONS
# ============================================================

echo ""
echo "⚙️ GitHub Actions..."

LATEST_RUN="$(gh run list \
    --repo "$OWNER_REPO" \
    --limit 1 \
    --json status,conclusion,name,url \
    --jq '.[0] | "\(.name) | status=\(.status) | conclusion=\(.conclusion) | \(.url)"' \
    2>/dev/null || true)"

if [ -n "$LATEST_RUN" ]; then

    echo "$LATEST_RUN"

else

    echo "ℹ️ Chưa tìm thấy GitHub Actions run."

fi

# ============================================================
# 21. RELEASE URL
# ============================================================

RELEASE_URL="${RELEASES_URL}/tag/${VERSION}"

TAG_URL="${REPO_URL}/releases/tag/${VERSION}"

# ============================================================
# 22. FINAL RESULT
# ============================================================

echo ""
echo ""
echo "============================================================"
echo "              🎉 DEPLOY HOÀN TẤT"
echo "============================================================"
echo ""

echo "👤 OWNER"
echo "------------------------------------------------------------"
echo "$GITHUB_USER"
echo ""

echo "📦 PROJECT"
echo "------------------------------------------------------------"
echo "$REPO_NAME"
echo ""

echo "🏷️ VERSION"
echo "------------------------------------------------------------"
echo "$VERSION"
echo ""

echo "============================================================"
echo "🌐 CÁC LINK QUAN TRỌNG"
echo "============================================================"
echo ""

echo "1️⃣  WEBSITE / APP"
echo "    $APP_URL"
echo ""

echo "2️⃣  GITHUB REPOSITORY"
echo "    $REPO_URL"
echo ""

echo "3️⃣  FORK CHO SINH VIÊN"
echo "    $FORK_URL"
echo ""

echo "4️⃣  RELEASES"
echo "    $RELEASES_URL"
echo ""

echo "5️⃣  RELEASE ${VERSION}"
echo "    $RELEASE_URL"
echo ""

echo "6️⃣  TAG ${VERSION}"
echo "    $TAG_URL"
echo ""

echo "7️⃣  GITHUB ACTIONS"
echo "    $ACTIONS_URL"
echo ""

echo "8️⃣  GITHUB PAGES SETTINGS"
echo "    $PAGES_SETTINGS_URL"
echo ""

echo "9️⃣  README"
echo "    $README_URL"
echo ""

echo "🔟 ISSUES"
echo "    $ISSUES_URL"
echo ""

echo "1️⃣1️⃣ DOWNLOAD ZIP"
echo "    $ZIP_URL"
echo ""

echo "============================================================"
echo "🎓 LINKS CHO SINH VIÊN"
echo "============================================================"
echo ""

echo "🌐 Chạy trực tiếp:"
echo "    $APP_URL"
echo ""

echo "🔀 Fork project:"
echo "    $FORK_URL"
echo ""

echo "📥 Clone project:"
echo "    git clone $CLONE_HTTPS"
echo ""

echo "📂 Sau khi clone:"
echo "    cd $REPO_NAME"
echo ""

echo "🚀 Chạy local:"
echo "    open index.html"
echo ""

echo "============================================================"
echo "📋 COPY BLOCK CHO SINH VIÊN"
echo "============================================================"
echo ""

echo "📚 ${REPO_NAME}"
echo ""
echo "🌐 Chạy ứng dụng:"
echo "$APP_URL"
echo ""
echo "🔀 Fork:"
echo "$FORK_URL"
echo ""
echo "📥 Clone:"
echo "$CLONE_HTTPS"
echo ""
echo "📦 Release:"
echo "$RELEASE_URL"
echo ""

echo "============================================================"
echo "        🚀 ${REPO_NAME} ${VERSION} READY"
echo "============================================================"
echo ""