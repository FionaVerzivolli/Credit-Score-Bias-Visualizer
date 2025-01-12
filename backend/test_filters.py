import pytest
from bias import user_matches_filters, calculate_filtered_false_positive_rate, calculate_filtered_demographic_parity, calculate_group_disparity, assign_letter_grade

# Sample User and Filter Classes for Tests
class User:
    def __init__(self, user_id, credit_score, defaulted, race=None, gender=None, continent=None, age=None):
        self.user_id = user_id
        self.credit_score = credit_score
        self.defaulted = defaulted
        self.race = race
        self.gender = gender
        self.continent = continent
        self.age = age

    def to_dict(self):
        return vars(self)


class Filter:
    def __init__(self, race=None, gender=None, continent=None, age=None):
        self.race = race
        self.gender = gender
        self.continent = continent
        self.age = age

    def to_dict(self):
        return vars(self)


# Test: user_matches_filters
def test_user_matches_filters():
    user = User(user_id=1, credit_score=750, defaulted=False, race="asian", gender="male", continent="asia", age="25").to_dict()
    filters = Filter(race="asian", gender="male", continent="asia", age="25").to_dict()

    assert user_matches_filters(user, filters) is True

    filters["continent"] = "europe"  # Intentional mismatch
    assert user_matches_filters(user, filters) is False


# Test: calculate_filtered_false_positive_rate
def test_calculate_filtered_false_positive_rate():
    users = [
        User(1, 550, False),
        User(2, 650, False),
        User(3, 450, True),
        User(4, 700, False),
    ]

    filters = Filter().to_dict()
    fpr = calculate_filtered_false_positive_rate([u.to_dict() for u in users], filters)
    assert fpr == pytest.approx(1 / 3, 0.01)  # 1 false positive, 2 true negatives


# Test: calculate_filtered_demographic_parity
def test_calculate_filtered_demographic_parity():
    users = [
        User(1, 750, False),
        User(2, 700, False),
        User(3, 650, False),
        User(4, 600, False),
    ]

    filters = Filter().to_dict()
    dp = calculate_filtered_demographic_parity([u.to_dict() for u in users], filters)
    assert dp == pytest.approx(2 / 4, 0.01)  # 2 approved out of 4 total


# Test: calculate_group_disparity
def test_calculate_group_disparity():
    users = [
        User(1, 750, False, race="asian"),
        User(2, 700, False, race="white"),
        User(3, 650, False, race="asian"),
        User(4, 600, False, race="white"),
    ]

    filters = Filter(race="asian").to_dict()
    disparity = calculate_group_disparity([u.to_dict() for u in users], filters)
    assert disparity == pytest.approx((750 + 650) / (700 + 600), 0.01)


# Test: assign_letter_grade
@pytest.mark.parametrize(
    "fpr, disparity, expected_grade",
    [
        (0.05, 0.95, "A"),
        (0.15, 0.85, "B"),
        (0.25, 0.75, "C"),
        (0.35, 0.65, "D"),
        (0.45, 0.55, "F"),
    ],
)
def test_assign_letter_grade(fpr, disparity, expected_grade):
    assert assign_letter_grade(fpr, disparity) == expected_grade
