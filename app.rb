require 'sinatra'

get '/' do
  html :index
end

post 'share' do

end

private

def html(view)
  File.read(File.join('public', "#{view.to_s}.html"))
end
