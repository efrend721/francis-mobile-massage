namespace FormWellness.Domain.Common;

public abstract class BaseEntity<TKey>
{
    public TKey Id { get; set; } = default!;
}

public abstract class AuditableEntity<TKey> : BaseEntity<TKey>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
