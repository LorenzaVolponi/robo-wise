import pandas as pd
from python.reports.quantstats import generate_report


def test_generate_report_calls_quantstats(mocker):
    series = pd.Series([1, 2, 3], index=pd.date_range("2020", periods=3))

    def fake_report(equity, benchmark=None, output=None):
        with open(output, "w") as fh:
            fh.write("<html></html>")

    mocked = mocker.patch("quantstats.reports.html", side_effect=fake_report)

    html = generate_report(series)

    assert html == "<html></html>"
    mocked.assert_called_once()
