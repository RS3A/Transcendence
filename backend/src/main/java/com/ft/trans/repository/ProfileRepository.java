package com.ft.trans.repository;

import com.ft.trans.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long>{
    List<Profile>  findByUserId(Long user_id);
}
