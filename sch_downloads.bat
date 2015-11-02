
::set bucket=gs://dfa_-80cd06d1a3e8ac93dc7862fcccbff7823af3e10a/
::set date =

::gsutil %bucket%NetworkClick_2621_08-08-2015.log.gz C:/Users/STAN97/Documents/data_transfer >> data_transfer/download_log.txt 2>&1
::7z x data_transfer/NetworkClick_2621_08-08-2015.log.gz o C:/Users/STAN97/Documents/data_transfer

::set dayCnt=4

::for /f "delims=" %%a in ('date_caller.py') do set "$date=%%a"
::echo the recuperated date is %$date% 

::set /a x=0
::set /a total=1
:::while
::if %x% lss %total% (
 
 :: set /a x+=1
::  goto :while
::)
::echo Test
if not exist "data_transfer" mkdir data_transfer
python -c "import daily_download; daily_download.download_data_transfer(100)"
::node daily_upload.js
pause;