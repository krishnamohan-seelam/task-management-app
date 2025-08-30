from dataclasses import dataclass
@dataclass
class UpdateResult:
    matched: bool
    modified: bool