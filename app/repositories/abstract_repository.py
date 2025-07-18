from abc import ABC, abstractmethod
from typing import Any, Dict, List

class AbstractRepository(ABC):
    @abstractmethod
    async def create(self, obj: Dict) -> Any:
        pass

    @abstractmethod
    async def get(self, obj_id: str) -> Dict:
        pass

    @abstractmethod
    async def update(self, obj_id: str, obj_update: Dict) -> bool:
        pass

    @abstractmethod
    async def delete(self, obj_id: str) -> bool:
        pass

    @abstractmethod
    async def get_all(self) -> List[Dict]:
        pass
