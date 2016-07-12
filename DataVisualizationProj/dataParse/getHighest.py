import ast, operator

for i in range(2, 6):
    filename = str(i) + "_data"
    newFile = str(i) + "stats"
    fo = open(filename, "r")
    fo2 = open(newFile, "w")

    hCom = []
    wCom = []
    lCom = []
    l2Com = []
    for line in fo:
        line = ast.literal_eval(line)
        tmp = {}
        tmp['first_hero_id'] = line['first_hero_id']
        tmp['second_hero_id'] = line['second_hero_id']
        tmp['win_games'] = line['win_games']
        tmp['win_rate'] = line['win_rate']
        tmp['combination_games'] = line['combination_games']
        tmp['combination_rate'] = line['combination_rate']
        tmp['first_hero'] = line['first_hero']
        tmp['second_hero'] = line['second_hero']
        if ('third_hero_id' in line):
            tmp['third_hero_id'] = line['third_hero_id']
            tmp['third_hero'] = line['third_hero']
        if ('forth_hero_id' in line):
            tmp['forth_hero_id'] = line['forth_hero_id']
            tmp['forth_hero'] = line['forth_hero']
        if ('fifth_hero_id' in line):
            tmp['fifth_hero_id'] = line['fifth_hero_id']
            tmp['fifth_hero'] = line['fifth_hero']
        if len(hCom) < 10:
            hCom.append(tmp)
            hCom = sorted(hCom, key=operator.itemgetter('combination_games'), reverse=True)
        else:
            if (line['combination_games'] > hCom[9]['combination_games']):
                hCom[9] = tmp;
                hCom = sorted(hCom, key=operator.itemgetter('combination_games'), reverse=True)
        if len(wCom) < 10:
            wCom.append(tmp)
            wCom = sorted(wCom, key=operator.itemgetter('win_rate'), reverse=True)
        else:
            if (line['win_rate'] > wCom[9]['win_rate']):
                wCom[9] = tmp;
                wCom = sorted(wCom, key=operator.itemgetter('win_rate'), reverse=True)
        if len(lCom) < 10:
            lCom.append(tmp)
            lCom = sorted(lCom, key=operator.itemgetter('combination_games'))
        else:
            if (line['combination_games'] < lCom[9]['combination_games']):
                lCom[9] = tmp;
                lCom = sorted(lCom, key=operator.itemgetter('combination_games'))
        if len(l2Com) < 10:
            l2Com.append(tmp)
            l2Com = sorted(l2Com, key=operator.itemgetter('win_rate'))
        else:
            if (line['win_rate'] < l2Com[9]['win_rate']):
                l2Com[9] = tmp;
                l2Com = sorted(l2Com, key=operator.itemgetter('win_rate'))
            

    fo.close()
    for each in hCom:
        fo2.write(str(each) + "\n")
    fo2.write("\n")
    for each in wCom:
        fo2.write(str(each) + "\n")
    fo2.write("\n")
    for each in lCom:
        fo2.write(str(each) + "\n")
    fo2.write("\n")
    for each in l2Com:
        fo2.write(str(each) + "\n")
    fo2.close()


