import urllib2, time, json, sys, astfrom threading import Threaddef main():    # https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=27110133&key=816BF8F302846B7AFDFDC164CAD4876C    key = ""    key2 = ""    key3 = ""    key4 = ""    key5 = ""    key6 = ""    key7 = ""    key8 = ""    key9 = ""    key10 = ""    keyList = [key, key2, key3, key4, key5, key6, key7, key8, key9, key10]    while True:        try:            match_history = urllib2.urlopen("https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=" + key).read()        except urllib2.HTTPError or urllib2.URLError, err:            print(err)            time.sleep(10)            continue        break    parsed_json = json.loads(match_history)    block = parsed_json['result']    first_match_id = block['matches'][0]['match_id']    match_id = first_match_id    #filename = "data3"    #fo = open(filename, "r")    #for line in fo:    #    pass    #last = ast.literal_eval(line) ## Convert from str to dict    #######################################    #startMatch = last['match_id'] + 1    startMatch = 2179975359    #fo.close()    amount = 100000    start = []    stop = []    start.append(startMatch)    for i in range(1, 10):        start.append(start[i-1] + amount)    for i in range(0, 10):        stop.append(start[i] + amount-1)            try:        for i in range(0, 10):            t = Thread(target=pullData, args=(str(i+1), "data" + str(i), start[i], stop[i], keyList[i]))            t.start()    except:        print "Error: unable to start thread."    #######################################    def pullData(threadName, filename, start, stop, key):        fo = open(filename, "w")    for i in range(start, stop):        print(threadName + "-" + str(stop-i) + "\n")        time.sleep(1)        #print(threadName + ": " + str((stop-i)) + " left" + "\n")        count = 0.0        while True:           try:               savedData = urllib2.urlopen("https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=" + str(i) + "&key=" + key).read()           except urllib2.HTTPError, err:               print(threadName + " " + str(err))               time.sleep(10)               continue           break               parsed_json = json.loads(savedData)        #print(parsed_json['result']['game_mode'])        #print((parsed_json['result']['game_mode']==21))        #print(parsed_json['result'])        if (len(parsed_json['result'])==1):            continue        if (parsed_json['result']['game_mode']==1 or            parsed_json['result']['game_mode']==2 or            parsed_json['result']['game_mode']==3 or            parsed_json['result']['game_mode']==4 or            parsed_json['result']['game_mode']==5 or            parsed_json['result']['game_mode']==8 or            parsed_json['result']['game_mode']==9 or            parsed_json['result']['game_mode']==12 or            parsed_json['result']['game_mode']==16 or            parsed_json['result']['game_mode']==22):                        if validMatch(parsed_json):                #print(str(i) + " is a valid match.")                radiant = getRadiantHeroes(parsed_json)                dire = getDireHeroes(parsed_json)                winner = getWinner(parsed_json)                dict = {}                dict['match_id'] = i                dict['radiant_heroes'] = radiant                dict['dire_heroes'] = dire                dict['winner'] = winner                dict['duration'] = getDuration(parsed_json)                fo.write(str(dict) + "\n")        ## 1ap 2cm 3rd 4sd 5ar 8rcm 9 12 16 22        print("Finished-" + threadName)    fo.close();    def getDuration(parsed_json):    return parsed_json['result']['duration']def validMatch(parsed_json):    for i in range(0, 10):        if parsed_json['result']['human_players'] != 10:            return False        if parsed_json['result']['players'][i]['leaver_status'] != 0:            return False        if parsed_json['result']['first_blood_time'] <= 0:            return False    return Truedef getWinner(parsed_json):    if 'radiant_win' in parsed_json['result']:        if parsed_json['result']['radiant_win'] == False:            return "Dire"        else:            return "Radiant"def getDireHeroes(parsed_json):    heroList = []    for i in range(5, 10):        hero_id = parsed_json['result']['players'][i]['hero_id']        heroList.append(hero_id)    return heroListdef getRadiantHeroes(parsed_json):    heroList = []    for i in range(0, 5):        hero_id = parsed_json['result']['players'][i]['hero_id']        #print(hero_id)        heroList.append(hero_id)    return heroList        if __name__ == "__main__":    main()