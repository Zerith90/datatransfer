import datetime
import os
import time
import fnmatch
import gzip

copy_command = 'gsutil cp gs://'
bucket='dfa_-80cd06d1a3e8ac93dc7862fcccbff7823af3e10a/'
mbs_bucket=''
networkClick = 'NetworkClick_2621_'
networkImpressions = 'NetworkImpression_2621_'
networkActivity = 'NetworkActivity_2621_[0-9]*_'
click_local_folder=" data_transfer/networkClick"
imp_local_folder=" data_transfer/networkImpressions"
activity_local_folder=" data_transfer/networkActivity"
log_files=" 2>>data_transfer/data_transfer_log.txt"

def download_data_transfer(daysBefore):
	
	for i in xrange(1,daysBefore):
		dateReq = datetime.date.fromordinal(datetime.date.today().toordinal()-i)
		dateReq = dateReq.strftime("%m-%d-%Y")
		print(dateReq)
		
		download_clicks(dateReq)
		download_impression(dateReq)
		download_activity(dateReq)
	#end_batch()

###################################################################################################
################################## Downloading Network Clicks #####################################
##Format : gsutil cp gs://[hash of network ID]/NetworkClick_[network_id]_[MM-DD-YYYY].log.gz##
###################################################################################################
def download_clicks(dateReq):
	click_time_start=time.time()
	download_clicks = copy_command + bucket + networkClick + dateReq + '.log.gz' + click_local_folder + log_files
	os.system(download_clicks)
	time_taken = str(time.time() - click_time_start)
	os.system('echo '+ str(time.time()) + ' Download complete:'+ networkClick + dateReq + ', Time Taken: '+ time_taken +'s >> data_transfer/updates.txt')
	#unzip the file
	downloaded_file_name = 'data_transfer/'+ networkClick + dateReq + '.log.gz'
	with gzip.open(downloaded_file_name, 'rb') as f:
  	   for line in f:
  	   		os.system('echo ' + line)
	os.system('7z x '+ downloaded_file_name +' -odata_transfer')
	unzipped_file_name = 'data_transfer/networkClick/'+ networkClick + dateReq + '.log'
	#log stats
	os.system('echo '+str(datetime.datetime.now())+':  '+networkClick + dateReq +','+ time_taken+','+ str(os.stat(downloaded_file_name).st_size/(1024.00*1024.00)) +','+ str(os.stat(unzipped_file_name).st_size/(1024.00*1024.00)) +'>>data_stats.txt')
	os.remove('data_transfer/'+ networkClick + dateReq + '.log.gz')
############################################## End ##########################################################

###################################################################################################
################################ Downloading Network Impressions###################################
##Format : gsutil cp gs://[hash of network ID]/NetworkImpression_[network_id]_[MM-DD-YYYY].log.gz##
###################################################################################################
def download_impression(dateReq):
	imp_time_start=time.time()
	download_imp = copy_command + bucket + networkImpressions + dateReq + '.log.gz' + imp_local_folder + log_files
	os.system(download_imp)
	time_taken = str(time.time() - imp_time_start)
	os.system('echo '+ str(time.time()) + ' Download complete:'+ networkImpressions + dateReq + ', Time Taken: '+ time_taken +'s >> data_transfer/updates.txt')
	#unzip file
	downloaded_file_name = 'data_transfer/networkImpressions/'+ networkImpressions + dateReq + '.log.gz'
	os.system('7z x data_transfer/networkImpressions/'+ networkImpressions + dateReq + '.log.gz -odata_transfer')
	unzipped_file_name = 'data_transfer/networkImpressions/'+ networkImpressions + dateReq + '.log'
	#log stats
	os.system('echo '+str(datetime.date.fromordinal(datetime.date.today().toordinal()))+':  '+networkImpressions + dateReq +','+ time_taken+','+ str(os.stat(downloaded_file_name).st_size/(1024.00*1024.00)) +','+ str(os.stat(unzipped_file_name).st_size/(1024.00*1024.00)) +'>>data_stats.txt')
	os.remove('data_transfer/'+ networkImpressions + dateReq + '.log.gz')
############################################## End ###########################################################

##############################################################################################################
################################ Downloading Network Activity#################################################
##Format : gsutil cp gs://[hash of network ID]/NetworkActivity_[network_id]_[Account_id]_[MM-DD-YYYY].log.gz##
##############################################################################################################
def download_activity(dateReq):
	act_time_start=time.time()
	download_imp = copy_command + bucket + networkActivity + dateReq + '.log.gz' + activity_local_folder + log_files
	os.system(download_imp)
	os.system('echo '+ str(time.time()) + 'Download complete:'+ networkActivity + dateReq + ', Time Taken: '+ str(time.time() - imp_time_start) +'s >> data_transfer/updates.txt')
	#unzip files
	for fn in os.listdir('data_transfer'):
		if fnmatch.fnmatch(fn, 'NetworkActivity_*'):
			print fn
			os.system('7z x data_transfer/networkActivity/'+fn + ' -odata_transfer')
			os.system('echo '+str(datetime.date.fromordinal(datetime.date.today().toordinal()))+':  '+fn +','+ time_taken+','+ str(os.stat(downloaded_file_name).st_size/(1024.00*1024.00)) +','+ str(os.stat(unzipped_file_name).st_size/(1024.00*1024.00)) +'>>data_stats.txt')	
################################################################################################################
#decouples unzipping and deleting of files as they may occur concurrently, resulting in an error deletion>unzip#
################################################################################################################

	for fn in os.listdir('data_transfer'):
		if fnmatch.fnmatch(fn, '*.log.gz'):
			print fn+': deleted'
			os.remove('data_transfer/networkActivity/'+ fn )
		
	os.system('echo '+str(time.time())+':  Total Time Taken: '+ str(time.time() - act_time_start) +'s >> data_transfer/updates.txt')
############################################## End ####################################################

	###################################################################################################
	############################## Add new line to the text file ######################################
	###################################################################################################
def end_batch():
	os.system('echo.>> data_transfer/updates.txt')