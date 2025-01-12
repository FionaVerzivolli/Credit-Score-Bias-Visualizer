'''
Note: we don't need the classes right now, but I 
won't delete them in case we want to use OOP pillars
or if we want to extend our code later.
'''
class User:
    def __init__(self, user_id, credit_score, gender, race, continent, age, defaulted):
        self.user_id = user_id
        self.credit_score = credit_score
        self.race = race
        self.gender = gender
        self.continent = continent
        if age < 12:
            self.age_group = "child"
        elif age < 17:
            self.age_group = "teen"
        elif age < 64:
            self.age_group = "adult"
        else:
            self.age_group = "senior"
        self.defaulted = defaulted



class Filter:
    def __init__(self, gender=None, race=None, continent=None, age_group=None):
        self.gender = gender
        self.race = race
        self.continent = continent
        self.age_group = age_group


def user_matches_filters(user, filters):
    if filters.gender and getattr(user, 'gender', None) != filters.gender:
        return False
    if filters.continent and getattr(user, 'continent', None) != filters.continent:
        return False
    if filters.age_group and getattr(user, 'age_group', None) != filters.age_group:
        return False
    if filters.race and getattr(user, 'race', None) != filters.race:
        return False
    return True

def calculate_filtered_false_positive_rate(users, filters):
    false_positives = 0
    true_negatives = 0

    for user in users:
        if user_matches_filters(user, filters):
            if user["credit_score"] < 600 and not user["defaulted"]:
                print(f"False Positive: ID={user['user_id']}")
                false_positives += 1
            if user["credit_score"] >= 600 and not user["defaulted"]:
                print(f"True Negative: ID={user['user_id']}")
                true_negatives += 1

    print(f"False Positives: {false_positives}, True Negatives: {true_negatives}")
    return (false_positives + true_negatives) > 0 and (
        false_positives / (false_positives + true_negatives)
    ) or 0.0


def calculate_filtered_demographic_parity(users, filters):
    approved = 0
    total = 0

    for user in users:
        if user_matches_filters(user, filters):
            print(f"Matched User: ID={user['user_id']}, Credit Score={user['credit_score']}")
            if user["credit_score"] >= 700:
                approved += 1
            total += 1

    print(f"Approved: {approved}, Total: {total}")
    return total > 0 and (approved / total) or 0.0


def calculate_group_disparity(users, group_filters):
    avg_score_group = 0
    avg_score_others = 0
    count_group = 0
    count_others = 0

    for user in users:
        if user_matches_filters(user, group_filters):
            avg_score_group += user["credit_score"]
            count_group += 1
        else:
            avg_score_others += user["credit_score"]
            count_others += 1

    if count_group == 0 or count_others == 0:
        return 0.0

    avg_score_group /= count_group
    avg_score_others /= count_others

    return avg_score_group / avg_score_others if avg_score_others > 0 else 0.0


def assign_letter_grade(fpr, disparity):
    if fpr <= 0.1 and disparity >= 0.9:
        return "A"
    elif fpr <= 0.2 and disparity >= 0.8:
        return "B"
    elif fpr <= 0.3 and disparity >= 0.7:
        return "C"
    elif fpr <= 0.4 and disparity >= 0.6:
        return "D"
    else:
        return "F"


def user_matches_filters(user, filter):
    if filter.get("race") and user.get("race") != filter["race"]:
        print(f"Filter Mismatch: Race (Expected: {filter['race']}, Got: {user.get('race')})")
        return False
    if filter.get("gender") and user.get("gender") != filter["gender"]:
        print(f"Filter Mismatch: Gender (Expected: {filter['gender']}, Got: {user.get('gender')})")
        return False
    if filter.get("continent") and user.get("continent") != filter["continent"]:
        print(f"Filter Mismatch: Continent (Expected: {filter['continent']}, Got: {user.get('continent')})")
        return False
    if filter.get("age") and user.get("age") != filter["age"]:
        print(f"Filter Mismatch: Age (Expected: {filter['age']}, Got: {user.get('age')})")
        return False
    return True
