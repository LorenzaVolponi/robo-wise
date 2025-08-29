import pandas as pd
from python.reports.quantstats import generate_report


def test_generate_report_calls_quantstats(mocker):
    series = pd.Series([1, 2, 3], index=pd.date_range("2020", periods=3))
    mock_html = "<html></html>"
    mocked = mocker.patch("quantstats.reports.html", return_value=mock_html)

    html = generate_report(series)

    assert html == mock_html
    mocked.assert_called_once_with(series, benchmark=None, output=None)
