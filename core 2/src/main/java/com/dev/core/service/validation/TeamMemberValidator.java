package com.dev.core.service.validation;

import com.dev.core.exception.ValidationFailedException;
import com.dev.core.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamMemberValidator {

    private final TeamMemberRepository teamMemberRepository;

    public void validateBeforeUpdate(Long teamMemberId) {
        if (teamMemberId == null)
            throw new ValidationFailedException("error.teammember.id.required",null);

        if (!teamMemberRepository.existsById(teamMemberId))
            throw new ValidationFailedException("error.teammember.notfound", new Object[]{teamMemberId});
    }

    public void validateBeforeDelete(Long teamMemberId) {
        if (teamMemberId == null)
            throw new ValidationFailedException("error.teammember.id.required",null);

        if (!teamMemberRepository.existsById(teamMemberId))
            throw new ValidationFailedException("error.teammember.notfound", new Object[]{teamMemberId});
    }
}
