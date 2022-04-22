# Partly taken from https://about.gitlab.com/blog/2017/11/27/go-tools-and-gitlab-how-to-do-continuous-integration-like-a-boss/

.PHONY: all dep build test coverage coverhtml lint docs

# Sphinx.

SPHINX_OPTS    ?= -W
SPHINX_BUILD   ?= sphinx-build
SPHINX_SOURCEDIR     = ./docs
SPHINX_BUILDDIR      = ./docs/_build

docs:
	@$(SPHINX_BUILD) -b html "$(SPHINX_SOURCEDIR)" "$(SPHINX_BUILDDIR)" $(SPHINX_OPTS) $(O)
