package edu.cit.alibata.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {
    @Autowired
    UserRepository userRepo;
    
    // Create
    public UserEntity postUserEntity(UserEntity user){
        if (user.isAdmin() == false){
            user.setAdmin(false);
        }
        if (user.getSubscriptionStatus() == false){
            user.setSubscriptionStatus(false);
        }
        return userRepo.save(user);
    }

    // Read All Users
    public List<UserEntity> getAllUserEntity(){
        return userRepo.findAll();
    }

    // Read Single User
    public UserEntity getUserEntity(int userId){
        return userRepo.findById(userId).get();
    }

    // Update
    public UserEntity putUserEntity(int userId, UserEntity newUser){
        try {
            UserEntity user = userRepo.findById(userId).get();
            user.setName(newUser.getName());
            user.setEmail(newUser.getEmail());
            user.setGender(newUser.getGender());
            user.setPassword(newUser.getPassword());
            user.setAdmin(newUser.isAdmin());
            user.setSubscriptionStatus(newUser.getSubscriptionStatus());
            return userRepo.save(user);
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("User "+ userId + "not found!");
        }
    }

    // Delete
    @SuppressWarnings("unused")
    public String deleteUserEntity(int userId){
        if (userRepo.findById(userId) != null){
            userRepo.deleteById(userId);
            return "User " +userId+ "Deleted Successfully!";
        } else {
            return "User " +userId+ "not found!";
        }
    }
}
