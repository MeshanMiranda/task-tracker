package com.example.tasktracker.service;

import com.example.tasktracker.dto.TaskRequest;
import com.example.tasktracker.dto.TaskResponse;
import com.example.tasktracker.dto.UserDto;
import com.example.tasktracker.entity.Role;
import com.example.tasktracker.entity.Task;
import com.example.tasktracker.entity.TaskStatus;
import com.example.tasktracker.entity.User;
import com.example.tasktracker.repository.TaskRepository;
import com.example.tasktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Page<TaskResponse> getTasks(Long ownerId, TaskStatus status, Pageable pageable) {
        User currentUser = getCurrentUser();
        
        if (currentUser.getRole() == Role.ADMIN) {
            if (ownerId != null && status != null) {
                User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
                return taskRepository.findByOwnerAndStatusAndValid(owner, status, 1, pageable).map(this::mapToResponse);
            } else if (ownerId != null) {
                User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
                return taskRepository.findByOwnerAndValid(owner, 1, pageable).map(this::mapToResponse);
            } else if (status != null) {
                return taskRepository.findByStatusAndValid(status, 1, pageable).map(this::mapToResponse);
            } else {
                return taskRepository.findByValid(1, pageable).map(this::mapToResponse);
            }
        } else {
            // Regular user can only see their own tasks
            if (status != null) {
                return taskRepository.findByOwnerAndStatusAndValid(currentUser, status, 1, pageable).map(this::mapToResponse);
            } else {
                return taskRepository.findByOwnerAndValid(currentUser, 1, pageable).map(this::mapToResponse);
            }
        }
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (task.getValid() == 0) {
            throw new RuntimeException("Task not found");
        }
        checkAccess(task);
        return mapToResponse(task);
    }

    public TaskResponse createTask(TaskRequest request) {
        User currentUser = getCurrentUser();
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .owner(currentUser)
                .valid(1)
                .build();
        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (task.getValid() == 0) {
            throw new RuntimeException("Task not found");
        }
        checkAccess(task);
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (task.getValid() == 0) {
            throw new RuntimeException("Task not found");
        }
        checkAccess(task);
        task.setValid(0);
        taskRepository.save(task);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void checkAccess(Task task) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN && !task.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
    }

    private TaskResponse mapToResponse(Task task) {
        UserDto userDto = UserDto.builder()
                .id(task.getOwner().getId())
                .name(task.getOwner().getName())
                .username(task.getOwner().getUsername())
                .email(task.getOwner().getEmail())
                .role(task.getOwner().getRole().name())
                .createdAt(task.getOwner().getCreatedAt())
                .build();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .owner(userDto)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
