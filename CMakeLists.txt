cmake_minimum_required(VERSION 3.10)
project(MyCppApp)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)

# Add the executable
add_executable(my_app
    backend/main.cpp
    backend/bias.cpp
    backend/user.h
    backend/userlist.h)
