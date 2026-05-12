#!/usr/bin/env ruby
# Compatibility wrapper for the model-only updated-date workflow.

require "rbconfig"

script = File.expand_path("update_updated.rb", __dir__)
exec(RbConfig.ruby, script, "--models", *ARGV)
