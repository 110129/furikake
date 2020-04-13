require 'bundler/setup'
Bundler.require

require './app.rb'

run Sinatra::Application
