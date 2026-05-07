from fastapi import Depends, HTTPException, status
from app.auth.jwt import get_current_user_payload

class RoleRequired:
    """Dependency that checks if the current user has one of the allowed roles."""

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, payload: dict = Depends(get_current_user_payload)):
        role = payload.get("role", "user")
        if role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для выполнения этого действия",
            )
        return payload

require_admin = RoleRequired(["admin"])
require_manager = RoleRequired(["manager", "admin"])
require_user = RoleRequired(["user", "manager", "admin"])
