namespace Pixelmon.Api.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public sealed class AdminProtectedAttribute(int minimumPermissionLevel = 3) : Attribute
{
    public int MinimumPermissionLevel { get; } = minimumPermissionLevel;
}
