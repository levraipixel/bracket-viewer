require 'google/apis/sheets_v4'

class BracketsController < ApplicationController
  def show
    respond_to do |format|
      format.html { show_html }
      format.json { show_json }
    end
  end

  private

  def show_html
    spreadsheet_id = params[:spreadsheet_id]

    service = Google::Apis::SheetsV4::SheetsService.new
    service.key = ENV['GOOGLE_API_KEY']
    response = service.get_spreadsheet spreadsheet_id

    @spreadsheet_url = response.spreadsheet_url
    @spreadsheet_title = response.properties.title
  end

  def show_json
    # TODO: check that ID is alphanumerical
    spreadsheet_id = params[:spreadsheet_id]
    range = "Bracket!A7:ZZ"

    service = Google::Apis::SheetsV4::SheetsService.new
    service.key = ENV['GOOGLE_API_KEY']
    response = service.get_spreadsheet_values spreadsheet_id, range

    rows = response.values
    if rows.empty?
      puts "No data found."
      return
    end

    last_row_idx = 0
    steps_count = 1
    rows.each_with_index do |row, row_idx|
      last_row_idx = row_idx unless (row.first || '').empty?
      steps_count = [
        steps_count,
        1 + row.count / 4
      ].max
    end
    tables_count = 1 + (last_row_idx / 3)

    puts "Steps count: #{steps_count}"
    puts "Tables count: #{tables_count}"

    bracket = (0...steps_count).map do |step|
      (0...tables_count).map do |table|
        [
          [
            rows[table*3][step*4],
            rows[table*3][step*4 + 1]
          ], [
            rows[table*3 + 1][step*4],
            rows[table*3 + 1][step*4 + 1],
          ]
        ]
      end
    end

    render json: bracket
  end
end
