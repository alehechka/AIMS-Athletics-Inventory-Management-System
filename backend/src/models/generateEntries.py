import sys
import json
import names
import random
from faker import Faker 

FAKE = Faker()

STATUSES = [
    {"name" : "Freshman", "academicYear" : 1},
    {"name" : "Sophomore", "academicYear" : 2},
    {"name" : "Junior", "academicYear" : 3},
    {"name" : "Senior", "academicYear" : 4}]

ORGANIZATIONS = [
    { "name": "University of Nebraska Omaha", "shortName": "UNO", "logo": "unomaha.ico" },
    { "name": "Creighton University", "shortName": "Creighton", "logo": "creighton.ico"}
]

SPORTS = [
    {"name": "Administration", "icon": "people"},
    {"name": "Baseball", "gender": "M", "icon": "sports_baseball"},
    {"name": "Volleyball", "gender": "F", "icon": "sports_volleyball"},
    {"name": "Soccer", "gender": "M"},
    {"name": "Softball", "gender": "F"}
]

#POOLS FOR SIZES AND EQUIPMENT
SIZES = ["XL", "L", "M", "S"]
COLORS = ["Black", "Green", "Navy", "White", "Teal", "Silver", "Grey", "Red", "Blue", "Purple", "Yellow", "Brown", "Orange", 
            "Violet", "Tan", "Salmon", "Cyan", "Cream", "Pink", "Gold"]

APPAREL = ["T-Shirt", "Tank Top", "Ball Cap", "Shorts", "Pants", "Sweatpants", "Sweater", "Overcoat", "Jacket", "Long Sleeve T-Shirt", 
            "Vest", "Gloves", "Socks", "Sleeveless Top", "Coat", "Gym Shorts" , "Long Socks", "Helmet", "Sweatband", "Balaclava" , "Hat", 
            "Beanie", "Headband", "Compression Shorts", "Hoodie", "Half-Zip Jacket"]

EQUIPMENT_MAX = len(COLORS) * len(APPAREL)

def main():
    try:
        arg_list = str(sys.argv)
        user_number = int(arg_list.split(' ')[1].split('\'')[1])
        inventory_number = int(arg_list.split(' ')[2].split('\'')[1])
        #if(inventory_number > EQUIPMENT_MAX):
        #    print("Only " + EQUIPMENT_MAX + " items can be generated, using this amount instead")
        #    inventory_number = EQUIPMENT_MAX
    except:
        sys.exit("Proper command usage is: generateEntries.py NO_OF_USERS NO_OF_INVENTORY")

    print("Generating data for " + str(user_number) + " users and " + str(inventory_number) + " inventory items")
    
    user_list, cred_list, sport_sizes_list, inventory_list = [],[],[],[]
    random_locker_no = random.sample(range(0,user_number), user_number)

    cred_list.append({ "email": "admin@admin.com", "password": "admin", "isAdmin": True, "isApproved": True, "isVerified": True })
    user_list.append({ "firstName": "Admin", "lastName": "Administrator"})

    cred_list.append({ "email": "employee@employee.com", "password": "employee", "isEmployee": True, "isApproved": True, "isVerified": True })
    user_list.append({"firstName": "Emp", "lastName": "Employee"})

    cred_list.append({ "email": "coach@coach.com", "password": "coach", "isCoach": True, "isApproved": True, "isVerified": True })
    user_list.append({ "firstName": "Coach", "lastName": "Smith"})

    for x in range(0, user_number):
        if x % 2 == 0:
            gender = "M"
            full_name = names.get_full_name(gender='male')
        else:
            gender = "F"
            full_name = names.get_full_name(gender='female')

        cred_list.append({
            "email" : full_name.split(" ")[0].lower() + full_name.split(" ")[1].lower() + "@athlete.com",
            "password" : full_name.split(" ")[0].lower() + full_name.split(" ")[1].lower() + "pw",
            "isAthlete" : True,
            "isApproved": True,
            "isVerified": True
        })

        #print(cred_list[x])

        user_list.append({
            "firstName": full_name.split(" ")[0],
            "lastName" : full_name.split(" ")[1],
            #"address" : FAKE.address().split("\n")[0],
            #"city" : "Omaha",
            #"state" : "NE",
            #"zip" : random.randrange(68101, 68198),
            #"phone" : "555-" + str(random.randrange(111,999)) + "-" + str(random.randrange(1111,9999)),
            #"lockerNumber" : random_locker_no[x],
            #"lockerCode" : str(random.randrange(11,99)) + "-" + str(random.randrange(11,99)) + "-" + str(random.randrange(11,99)),
            #"gender" : gender,
            #"height" : random.randrange(48,77),
            #"weight" : random.randrange(120,200),
            })

        #print(user_list[x])

    print("Generating equipment")

    for x in range(0, inventory_number):
        random_color = COLORS[random.randrange(0,len(COLORS))]
        random_apparel = APPAREL[random.randrange(0,len(APPAREL))]
        sport_sizes_list.append({
            "name" : random_apparel + " (" + random_color + ")",
            "sizes" : SIZES
        })
        print(sport_sizes_list[x])

        item_price= round(random.uniform(9.99, 99.99),2)

        inventory_sizes = []

        for z in range(0,len(SIZES)):
            inventory_sizes.append({"size": SIZES[z], "price": round(item_price - (len(SIZES) + z),2), "quantity" : random.randrange(1,100)})

        inventory_list.append({
            "name" : random_apparel + " (" + random_color + ")",
            "description" : random_color +" " + random_apparel,
            "sizes" : inventory_sizes,
            "surplus": False
        })

        #print(inventory_list[x])
    
    print(json.dumps(STATUSES))



    blob = "{ \"statuses\": " + json.dumps(STATUSES) + ", \n \"organizations\" : " + json.dumps(ORGANIZATIONS) + ", \n \"credentials\" : " + json.dumps(cred_list) + ", \n \"users\" : " + json.dumps(user_list) + ", \n \"sports\" : " + json.dumps(SPORTS) + ", \n \"sport_sizes\" : " + json.dumps(sport_sizes_list) + ", \n \"inventories\" : " + json.dumps(inventory_list) + " }"

    print(blob)

    file_to_write = open("backend\src\models\dataGenerated.json", "w")
   
    file_to_write.write(blob)
    file_to_write.close()

    print("done")

if __name__ == "__main__":
    main()