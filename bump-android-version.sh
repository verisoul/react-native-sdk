#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN} Bumping Android SDK version${NC}"
echo ""

BUILD_GRADLE="android/build.gradle"

# Check if build.gradle exists
if [ ! -f "$BUILD_GRADLE" ]; then
    echo -e "${RED}Error: $BUILD_GRADLE not found${NC}"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(grep 'api "ai.verisoul:android:' "$BUILD_GRADLE" | sed -n 's/.*api "ai.verisoul:android:\([0-9.a-zA-Z-]*\)".*/\1/p')

if [ -z "$CURRENT_VERSION" ]; then
    echo -e "${RED}Error: Could not find current Android SDK version in $BUILD_GRADLE${NC}"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

# Fetch latest version from GitHub repo
echo -e "${YELLOW}Fetching latest version from verisoul/native-android-sdk...${NC}"
LATEST_TAG=$(git ls-remote --tags --sort='v:refname' https://github.com/verisoul/native-android-sdk.git | tail -n1 | sed 's/.*refs\/tags\/v//' | sed 's/\^{}//')

if [ -z "$LATEST_TAG" ]; then
    echo -e "${RED}Error: Could not fetch latest version from GitHub${NC}"
    exit 1
fi

NEW_VERSION="$LATEST_TAG"

echo "Latest version: $NEW_VERSION"
echo ""

# Check if already up to date
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo -e "${GREEN} Already up to date!${NC}"
    exit 0
fi

# Update version in build.gradle
sed -i.bak "s/api \"ai.verisoul:android:$CURRENT_VERSION\"/api \"ai.verisoul:android:$NEW_VERSION\"/" "$BUILD_GRADLE"
rm "${BUILD_GRADLE}.bak"

echo -e "${GREEN} Updated $BUILD_GRADLE${NC}"

# Refresh Gradle dependencies
echo ""
echo -e "${YELLOW}Refreshing Gradle dependencies...${NC}"
if [ -d "example/android" ] && [ -f "example/android/gradlew" ]; then
    cd example/android
    chmod +x gradlew
    if ./gradlew --refresh-dependencies 2>&1 | grep -q "BUILD SUCCESSFUL\|BUILD FAILED"; then
        echo -e "${GREEN} Gradle dependencies refreshed${NC}"
    else
        echo -e "${YELLOW} Could not refresh Gradle dependencies${NC}"
        echo -e "${YELLOW} This is normal if Java/Android SDK is not installed locally${NC}"
        echo -e "${YELLOW} Dependencies will be pulled during CI build${NC}"
    fi
    cd ../..
elif [ -f "android/gradlew" ]; then
    cd android
    chmod +x gradlew
    if ./gradlew --refresh-dependencies 2>&1 | grep -q "BUILD SUCCESSFUL\|BUILD FAILED"; then
        echo -e "${GREEN} Gradle dependencies refreshed${NC}"
    else
        echo -e "${YELLOW} Could not refresh Gradle dependencies${NC}"
        echo -e "${YELLOW} This is normal if Java/Android SDK is not installed locally${NC}"
        echo -e "${YELLOW} Dependencies will be pulled during CI build${NC}"
    fi
    cd ..
else
    echo -e "${YELLOW} Gradle wrapper not found${NC}"
    echo -e "${YELLOW} Dependencies will be pulled during CI build${NC}"
fi

# Commit changes
echo ""
git add "$BUILD_GRADLE"
git commit -m "Update verisoul/native-android-sdk to version $NEW_VERSION"

echo ""
echo -e "${GREEN} Android SDK version bumped successfully!${NC}"
echo -e "${GREEN} $CURRENT_VERSION → $NEW_VERSION${NC}"
echo ""
echo "Next steps:"
echo "1. Run: ./bump-ios-version.sh"
echo "2. Run: make release-patch (or release-minor/release-major)"
echo "3. Push changes: git push --follow-tags"
