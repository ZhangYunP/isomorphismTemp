#coding:utf-8
import requests
from bs4 import BeautifulSoup
import multiprocessing
import random
import Queue
import time
import math
import re
q=Queue.Queue()


def getProxyIp():
    ipList= []
    try:
        randomPage= random.choice(xrange(10))
        res= requests.get('http://www.kuaidaili.com/free/inha/'+ str(randomPage))
    except:
        time.sleep(5)
        randomPage= random.choice(xrange(10))
        res= requests.get('http://www.kuaidaili.com/free/inha/'+ str(randomPage))
    soup = BeautifulSoup(res.content, 'html.parser')
    for ip in soup.select('table tbody td[data-title="IP"]'):
        ipConfig={}
        ipConfig['http']= "http://"+ ip.text
        ipList.append(ipConfig)
    return ipList

def dellComputeInfo(url, proxies, page):
    res= requests.get(url, proxies= proxies)
    soup= BeautifulSoup(res.content, 'html.parser')
    tmpCompNameList= []
    tmpCompPriceList= []
    tmpCompImg= []
    tmpCompConf= []
    dellinfoList= []
    for i in soup.select('a.fl-inv-head'):
        tmpCompNameList.append(i.get_text())
    for i in soup.select('.fl-inv-price span'):
        tmpCompPriceList.append(i.get_text())
    for i in soup.select('.fl-inv-img-col img'):
        tmpCompImg.append(i.get('src'))
    for i in soup.select('.fl-topalign ul'):
        tmpconf= []
        for j in i.find_all('span'):
            tmpconf.append(j.string)
        tmpCompConf.append(tmpconf)
    for x in xrange(len(tmpCompPriceList)):
        dellinfo= {}
        dellinfo['computeName']= tmpCompNameList[x]
        dellinfo['computePrice']= tmpCompPriceList[x]
        dellinfo['computeImg'] = tmpCompImg[x]
        dellinfo['computeconfigure']= tmpCompConf[x]
        dellinfo['page']= page
        dellinfoList.append(dellinfo)
    return dellinfoList

def getInfo():
    url = "http://outlet.us.dell.com/ARBOnlineSales/Online/LikeConfigDetails.aspx?ci0=SA&brandId=2201&CP=1"
    ipList= getProxyIp()
    try:
        proxies= random.choice(ipList)
        res= requests.get(url, proxies= proxies)
    except:
        time.sleep(5)
        proxies= random.choice(ipList)
        res= requests.get(url, proxies= proxies)
    soup= BeautifulSoup(res.content, 'html.parser')
    page= soup.select('.fl-stick-left div')[0].text
    pageArr= page.replace(u'\xa0', u' ').split(u' ')
    pageNum= int(pageArr[len(pageArr)- 1])
    allPage= int(math.ceil(pageNum/10.0))+ 1
    for i in xrange(1, allPage):
        dellUrl= "http://outlet.us.dell.com/ARBOnlineSales/Online/LikeConfigDetails.aspx?ci0=SA&brandId=2201&CP="+str(i)
        q.put(dellUrl)
    return proxies


if __name__ == '__main__':
    proxies= getInfo()
    pool= multiprocessing.Pool()
    infoList= []
    output= []
    while not q.empty():
        dellUrl= q.get()
        ma= re.match(r"(.*?)&CP=(\d+)", dellUrl)
        page= int(ma.group(2))
        infoList.append(pool.apply_async(dellComputeInfo, args= (dellUrl, proxies, page)))
        time.sleep(5)
    pool.close()
    pool.join()
    for i in infoList:
        output.extend(i.get())
    print output
