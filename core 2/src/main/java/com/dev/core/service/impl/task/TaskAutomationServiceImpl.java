package com.dev.core.service.impl.task;

import com.dev.core.domain.Task;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.repository.task.TaskRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.task.TaskAutomationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handles all automation events related to tasks — notifications, reminders,
 * progress updates, and dependency alerts.
 *
 * Delegates email and notification delivery to NotificationService.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskAutomationServiceImpl implements TaskAutomationService {

	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService; // ✅ Injected instead of extended

	// --------------------------------------------------------------
	// TASK CREATED
	// --------------------------------------------------------------
	@Override
	public void onTaskCreated(Long taskId) {
		Task task = findTask(taskId);
		log.info("⚙️ [Automation] Task created [{}]", task.getTitle());

		notifyAssignees(task, "🆕 New Task Assigned",
				"A new task '" + task.getTitle() + "' has been created and assigned to you.");

		// Future: auto-link to sprint, milestone, etc.
	}

	// --------------------------------------------------------------
	// TASK ASSIGNED
	// --------------------------------------------------------------
	@Override
	public void onTaskAssigned(Long taskId, Long userId) {
		Task task = findTask(taskId);
		User user = findUser(userId);

		log.info("📩 [Automation] Task [{}] assigned to [{}]", task.getTitle(), user.getEmail());

		notificationService.sendEmail(user.getEmail(), "📋 Task Assignment: " + task.getTitle(),
				"You have been assigned to the task '" + task.getTitle() + "'.");
	}

	// --------------------------------------------------------------
	// TASK STATUS CHANGED
	// --------------------------------------------------------------
	@Override
	public void onTaskStatusChanged(Long taskId, String oldStatus, String newStatus) {
		Task task = findTask(taskId);
		log.info("🔄 [Automation] Task [{}] status changed: {} → {}", task.getTitle(), oldStatus, newStatus);

		notifyAssignees(task, "🔄 Task Status Updated: " + task.getTitle(), "The task '" + task.getTitle()
				+ "' changed status from **" + oldStatus + "** to **" + newStatus + "**.");
	}

	// --------------------------------------------------------------
	// TASK COMPLETED
	// --------------------------------------------------------------
	@Override
	public void onTaskCompleted(Long taskId) {
		Task task = findTask(taskId);
		log.info("✅ [Automation] Task completed [{}]", task.getTitle());

		notifyAssignees(task, "🎉 Task Completed: " + task.getTitle(),
				"The task '" + task.getTitle() + "' has been completed successfully.");

		// TODO: trigger project progress recalculation
	}

	// --------------------------------------------------------------
	// ALL SUBTASKS COMPLETED
	// --------------------------------------------------------------
	@Override
	public void onSubtaskAllDone(Long parentTaskId) {
		Task parent = findTask(parentTaskId);
		log.info("🧩 [Automation] All subtasks completed for [{}]", parent.getTitle());

		sendEmailToOwner(parent, "All Subtasks Completed: " + parent.getTitle(),
				"All subtasks under '" + parent.getTitle() + "' have been completed. You may close this task.");
	}

	// --------------------------------------------------------------
	// COMMENT ADDED
	// --------------------------------------------------------------
	@Override
	public void onTaskCommentAdded(Long taskId, Long commentId) {
		Task task = findTask(taskId);
		log.info("💬 [Automation] Comment added for task [{}]", task.getTitle());

		notifyAssignees(task, "💬 New Comment on " + task.getTitle(),
				"A new comment was added to this task. Check the discussion for updates.");
	}

	// --------------------------------------------------------------
	// ATTACHMENT ADDED
	// --------------------------------------------------------------
	@Override
	public void onTaskAttachmentAdded(Long taskId, Long attachmentId) {
		Task task = findTask(taskId);
		log.info("📎 [Automation] Attachment added to [{}]", task.getTitle());

		notifyAssignees(task, "📎 New Attachment Added", "A new file was uploaded to task '" + task.getTitle() + "'.");
	}

	// --------------------------------------------------------------
	// PRIORITY CHANGED
	// --------------------------------------------------------------
	@Override
	public void onTaskPriorityChanged(Long taskId, String oldPriority, String newPriority) {
		Task task = findTask(taskId);
		log.info("⚡ [Automation] Priority changed [{}]: {} → {}", task.getTitle(), oldPriority, newPriority);

		notifyAssignees(task, "⚡ Task Priority Updated", "The task '" + task.getTitle()
				+ "' priority has been changed from " + oldPriority + " to " + newPriority + ".");
	}

	// --------------------------------------------------------------
	// TASK DELETED
	// --------------------------------------------------------------
	@Override
	public void onTaskDeleted(Long taskId) {
		log.info("🗑️ [Automation] Task deleted [{}]", taskId);
		// Future: log audit trail, remove dashboard entry, etc.
	}

	// --------------------------------------------------------------
	// DEPENDENCY RESOLVED
	// --------------------------------------------------------------
	@Override
	public void onDependencyResolved(Long taskId, Long dependencyId) {
		Task task = findTask(taskId);
		log.info("🔓 [Automation] Dependency resolved for [{}]", task.getTitle());

		notifyAssignees(task, "🔓 Dependency Resolved",
				"A blocking dependency for the task '" + task.getTitle() + "' has been resolved.");
	}

	// --------------------------------------------------------------
	// HELPER METHODS
	// --------------------------------------------------------------
	private Task findTask(Long id) {
		return taskRepository.findById(id)
				.orElseThrow(() -> new BaseException("error.task.not.found", new Object[] { id }));
	}

	private User findUser(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new BaseException("error.user.not.found", new Object[] { id }));
	}

	private void notifyAssignees(Task task, String subject, String body) {
		List<String> recipients = task.getAssignees().stream().map(User::getEmail).collect(Collectors.toList());

		recipients.forEach(email -> notificationService.sendEmail(email, subject, body));
	}

	private void sendEmailToOwner(Task task, String subject, String body) {
		if (task.getOwnerId() != null) {
			userRepository.findById(task.getOwnerId())
					.ifPresent(owner -> notificationService.sendEmail(owner.getEmail(), subject, body));
		}
	}

	// --------------------------------------------------------------
	// TASK DUE SOON
	// --------------------------------------------------------------
	@Override
	public void onTaskDueSoon(Long taskId) {
		Task task = findTask(taskId);

		if (task.getDueDate() == null) {
			log.debug("⏳ [Automation] Skipped due-soon check — no due date set for [{}]", task.getTitle());
			return;
		}

		log.info("⏰ [Automation] Task due soon [{}] (due: {})", task.getTitle(), task.getDueDate());

		String subject = "⏰ Task Due Soon: " + task.getTitle();
		String body = "The task '" + task.getTitle() + "' is due on **" + task.getDueDate() + "**.\n"
				+ "Please ensure it is completed or updated before the deadline.";

		// Notify all assignees
		notifyAssignees(task, subject, body);

		// Notify owner if exists
		sendEmailToOwner(task, subject, body);
	}

	// --------------------------------------------------------------
	// TASK OVERDUE
	// --------------------------------------------------------------
	@Override
	public void onTaskOverdue(Long taskId) {
		Task task = findTask(taskId);

		if (task.getDueDate() == null) {
			log.debug("⚠️ [Automation] Skipped overdue check — no due date set for [{}]", task.getTitle());
			return;
		}

		log.info("🚨 [Automation] Task overdue [{}] (due: {})", task.getTitle(), task.getDueDate());

		String subject = "🚨 Task Overdue: " + task.getTitle();
		String body = "The task '" + task.getTitle() + "' was due on **" + task.getDueDate()
				+ "** and is now overdue.\n" + "Please take immediate action or contact your project manager.";

		// Notify all assignees
		notifyAssignees(task, subject, body);

		// Escalate to owner / project manager
		sendEmailToOwner(task, subject + " — Escalation", body + "\n\nThis is an automated escalation notice.");
	}

}
