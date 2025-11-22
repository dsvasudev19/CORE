//package com.dev.core.wrapper;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletRequestWrapper;
//import java.util.*;
//
//public class OrganizationRequestWrapper extends HttpServletRequestWrapper {
//
//    private final Map<String, String[]> modifiedParams = new HashMap<>();
//
//    public OrganizationRequestWrapper(HttpServletRequest request, Long organizationId) {
//        super(request);
//
//        // Copy existing params
//        modifiedParams.putAll(request.getParameterMap());
//
//        // Inject or override organizationId
//        modifiedParams.put("organizationId", new String[]{String.valueOf(organizationId)});
//    }
//
//    @Override
//    public String getParameter(String name) {
//        String[] values = modifiedParams.get(name);
//        return values != null ? values[0] : null;
//    }
//
//    @Override
//    public Map<String, String[]> getParameterMap() {
//        return Collections.unmodifiableMap(modifiedParams);
//    }
//
//    @Override
//    public Enumeration<String> getParameterNames() {
//        return Collections.enumeration(modifiedParams.keySet());
//    }
//
//    @Override
//    public String[] getParameterValues(String name) {
//        return modifiedParams.get(name);
//    }
//}

package com.dev.core.wrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.util.*;

public class OrganizationRequestWrapper extends HttpServletRequestWrapper {

	private final Map<String, String[]> modifiedParams = new HashMap<>();
	private final boolean isMultipart;

	public OrganizationRequestWrapper(HttpServletRequest request, Long organizationId) {
		super(request);

		// Detect multipart request
		this.isMultipart = isMultipartRequest(request);

		// ❗ Do NOT call getParameterMap() for multipart
		if (!isMultipart) {
			modifiedParams.putAll(request.getParameterMap());
		}

		// Add/override organizationId safely
		modifiedParams.put("organizationId", new String[] { String.valueOf(organizationId) });
	}

	private boolean isMultipartRequest(HttpServletRequest request) {
		String contentType = request.getContentType();
		return contentType != null && contentType.toLowerCase().startsWith("multipart/");
	}

	@Override
	public String getParameter(String name) {
		if (isMultipart)
			return null; // Prevent forcing multipart parsing
		String[] values = modifiedParams.get(name);
		return values != null ? values[0] : null;
	}

	@Override
	public Map<String, String[]> getParameterMap() {
		if (isMultipart)
			return Collections.emptyMap(); // Safe for multipart
		return Collections.unmodifiableMap(modifiedParams);
	}

	@Override
	public Enumeration<String> getParameterNames() {
		if (isMultipart)
			return Collections.emptyEnumeration();
		return Collections.enumeration(modifiedParams.keySet());
	}

	@Override
	public String[] getParameterValues(String name) {
		if (isMultipart)
			return null;
		return modifiedParams.get(name);
	}
}
