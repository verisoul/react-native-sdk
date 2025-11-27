.PHONY: bump-android bump-ios release-patch release-minor release-major release-beta-patch release-beta-increment promote

bump-android:
	@chmod +x scripts/bump-android-version.sh
	@./scripts/bump-android-version.sh

bump-ios:
	@chmod +x scripts/bump-ios-version.sh
	@./scripts/bump-ios-version.sh

release-patch:
	@echo "Creating patch release..."
	@npm version patch
	@echo ""
	@echo "Patch release created!"
	@echo "Next step: git push --follow-tags"

release-minor:
	@echo "Creating minor release..."
	@npm version minor
	@echo ""
	@echo "Minor release created!"
	@echo "Next step: git push --follow-tags"

release-major:
	@echo "Creating major release..."
	@npm version major
	@echo ""
	@echo "Major release created!"
	@echo "Next step: git push --follow-tags"

release-beta-patch:
	@echo "Creating beta patch release..."
	@npm version prepatch --preid=beta
	@echo ""
	@echo "Beta patch release created!"
	@echo "Next step: git push --follow-tags"

release-beta-increment:
	@echo "Incrementing beta version..."
	@npm version prerelease --preid=beta
	@echo ""
	@echo "Beta version incremented!"
	@echo "Next step: git push --follow-tags"

promote:
	@echo "Promoting beta to stable release..."
	@CURRENT_VERSION=$$(node -p "require('./package.json').version"); \
	STABLE_VERSION=$$(echo $$CURRENT_VERSION | sed 's/-beta\.[0-9]*//'); \
	if [ "$$CURRENT_VERSION" = "$$STABLE_VERSION" ]; then \
		echo "Error: Current version ($$CURRENT_VERSION) is not a beta version"; \
		exit 1; \
	fi; \
	echo "Promoting $$CURRENT_VERSION -> $$STABLE_VERSION"; \
	npm version $$STABLE_VERSION
	@echo ""
	@echo "Beta promoted to stable release!"
	@echo "Next step: git push --follow-tags"
