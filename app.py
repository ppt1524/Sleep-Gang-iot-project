from flask import Flask, redirect, render_template, url_for, \
    json, request, current_app

app = Flask(__name__)


def getDataFrom(username):
    try:
        with current_app.open_resource(f'static/json_data/{username}/user_info.json') as f:
            data = f.read()
            data = data.decode('utf-8').replace("'", '"')
            data = json.loads(data)
            return data
    except:
        return False
    pass


def getDataFromFile(date):
    with current_app.open_resource(date) as f:
        data = f.read()
        data = data.decode('utf-8').replace("'", '"')
        data = json.loads(data)
        return data
    pass


def getDateInfo(username, date_info):
    dates_info = {}

    for i in date_info:
        file_name = date_info[i]
        date = f'static/json_data/{username}/{file_name}'
        date_data = getDataFromFile(date)["m2m:ae"]["m2m:cnt"]
        date__data = {}
        m = False
        for x in date_data:
            y = x["m2m:cin"]
            label = x["rn"]
            qty_data = []
            datee = []
            for z in y:
                if not m:
                    # label = "date"
                    datee.append(z["ct"])
                qty_data.append(z["con"])
            if not m:
                date__data["date"]=(datee)
            m = True
            date__data[label] = (qty_data)
        dates_info[i] = date__data

    return dates_info
    pass

logout = False

@app.route('/')
def index():
    global logout
    logout = True
    return render_template("index.html", notexist = False)


def printUserSleepInfo(user_data, date_info):
    for x in user_data:
        print(x, end='\t')
    print()
    for x in date_info:
        print(x)
        x = date_info[x]
        for i in range(len(x[0])):
            print(i+1, end='\t')
            for j in range(len(x)):
                print(x[j][i], end='\t')
            print()
        pass
        print("\n\n")


@app.route('/user/<username>')
def user(username):
    dta = getDataFrom(username)
    
    if (dta == False):
        return render_template('index.html', notexist = True, username = username)

    user_data = [dta["user"]["user_name"],
                 dta["user"]["age"],
                 dta["user"]["sex"],
                 dta["user"]["occupation"]
                 ]

    date_info = getDateInfo(username, dta["date_info"])
    dateVal = [x for x in date_info]

    # printUserSleepInfo(user_data, date_info)

    # print(date_info['30062022'])
    # print()
    # print(date_info['29062022'])
    # print()
    # print(date_info['28062022'])

    return render_template('user_info.html', username=username,
             user_data=user_data, logout = logout,
             date_info=date_info, dateVal = dateVal)


@app.route('/main', methods=['POST', 'GET'])
def main():
    username = ''
    global logout
    logout = False
    if request.method == 'POST':
        username = request.form['username']
    return redirect(url_for('user', username=username))


if __name__ == "__main__":
    app.run(debug=True)
