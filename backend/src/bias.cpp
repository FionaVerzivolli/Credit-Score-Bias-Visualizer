#include <iostream>
#include <vector>
#include <string>
#include "user.h"
#include "filters.h"

double calculateFilteredFalsePositiveRate(const std::vector<User>& users, const Filter& filters) {
    int falsePositives = 0, trueNegatives = 0;

    for (const auto& user : users) {
        if (userMatchesFilters(user, filters)) {
            if (user.credit_score < 600 && !user.defaulted) {
                std::cout << "False Positive: ID=" << user.user_id << std::endl;
                falsePositives++;
            }
            if (user.credit_score >= 600 && !user.defaulted) {
                std::cout << "True Negative: ID=" << user.user_id << std::endl;
                trueNegatives++;
            }
        }
    }

    std::cout << "False Positives: " << falsePositives
              << ", True Negatives: " << trueNegatives << std::endl;

    return (falsePositives + trueNegatives) > 0 
        ? static_cast<double>(falsePositives) / (falsePositives + trueNegatives) 
        : 0.0;
}




double calculateFilteredDemographicParity(const std::vector<User>& users, const Filter& filters) {
    int approved = 0, total = 0;

    for (const auto& user : users) {
        if (userMatchesFilters(user, filters)) {
            std::cout << "Matched User: ID=" << user.user_id
                      << ", Credit Score=" << user.credit_score << std::endl;

            if (user.credit_score >= 700) {
                approved++;
            }
            total++;
        }
    }

    std::cout << "Approved: " << approved
              << ", Total: " << total << std::endl;

    return total > 0 ? static_cast<double>(approved) / total : 0.0;
}


// calculate group disparity between two filtered groups
double calculateGroupDisparity(const std::vector<User>& users, const Filter& group1Filters, const Filter& group2Filters) {
    double avgScoreGroup1 = 0, avgScoreGroup2 = 0;
    int countGroup1 = 0, countGroup2 = 0;

    for (const auto& user : users) {
        if (userMatchesFilters(user, group1Filters)) {
            avgScoreGroup1 += user.credit_score;
            countGroup1++;
        } else if (userMatchesFilters(user, group2Filters)) {
            avgScoreGroup2 += user.credit_score;
            countGroup2++;
        }
    }

    if (countGroup1 == 0 || countGroup2 == 0) return 0.0;

    avgScoreGroup1 /= countGroup1;
    avgScoreGroup2 /= countGroup2;

    return avgScoreGroup2 > 0 ? avgScoreGroup1 / avgScoreGroup2 : 0.0;
}

// assign a letter grade based on bias metrics
std::string assignLetterGrade(double fpr, double disparity) {
    if (fpr <= 0.1 && disparity >= 0.9)
        return "A";
    else if (fpr <= 0.2 && disparity >= 0.8)
        return "B";
    else if (fpr <= 0.3 && disparity >= 0.7)
        return "C";
    else if (fpr <= 0.4 && disparity >= 0.6)
        return "D";
    else
        return "F";
}
