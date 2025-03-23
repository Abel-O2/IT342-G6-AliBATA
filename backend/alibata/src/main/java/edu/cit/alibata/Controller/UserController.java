package edu.cit.alibata.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.alibata.Entity.UserEntity;
import edu.cit.alibata.Service.UserService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "api/alibata/user")
public class UserController {
    @Autowired
    UserService userServ;

    //Create
    @PostMapping("/postUserEntity")
    public UserEntity postUserEntity(@RequestBody UserEntity user){
        return userServ.postUserEntity(user);
    }

    //Read All Users
    @GetMapping("/getAllUserEntity")
    public List<UserEntity> getAllUserEntity(){
        return userServ.getAllUserEntity();
    }

    //Read User
    @GetMapping("/getUserEntity")
    public UserEntity getUserEntity(@RequestParam int id){
        return userServ.getUserEntity(id);
    }

    //Update
    @PostMapping("/putUserEntity")
    public UserEntity putUserEntity(@RequestParam int id, @RequestBody UserEntity newUserEntity){
        return userServ.postUserEntity(newUserEntity);
    }

    //Delete
    @DeleteMapping("/deleteUserEntity")
    public String deleteUserEntity(@PathVariable int id){
        return userServ.deleteUser(id);
    }
}
