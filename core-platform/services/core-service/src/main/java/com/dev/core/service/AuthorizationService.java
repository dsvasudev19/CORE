package com.dev.core.service;

public interface AuthorizationService {
	void authorize(String resourceCode, String actionCode);
}
