Rails.application.routes.draw do
  get 'brackets/:spreadsheet_id' => 'brackets#show', as: :bracket
end
