package com.example.tasktracker.repository;

import com.example.tasktracker.entity.Task;
import com.example.tasktracker.entity.TaskStatus;
import com.example.tasktracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByOwnerAndValid(User owner, Integer valid, Pageable pageable);

    Page<Task> findByStatusAndValid(TaskStatus status, Integer valid, Pageable pageable);

    Page<Task> findByOwnerAndStatusAndValid(User owner, TaskStatus status, Integer valid, Pageable pageable);

    Page<Task> findByValid(Integer valid, Pageable pageable);
}
