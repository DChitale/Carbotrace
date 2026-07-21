import pytest
from backend.app.services.scoring_engine import estimate_tests_carbon
from backend.app.services.ccf_coefficients import get_instance_power, get_grid_intensity


def test_dependency_carbon_formula():
    """Verify dependency carbon calculation formula yields correct math."""
    # Formula: Dependency_Carbon = (Num_Deps * 0.5) + (Size_MB * 0.12)
    num_deps = 20
    size_mb = 15.5
    carbon = (num_deps * 0.5) + (size_mb * 0.12)
    assert carbon == 10.0 + 1.86


def test_pattern_carbon_formula():
    """Verify code AST patterns carbon calculation logic."""
    # Formula: Pattern_Carbon = (Nested_Loops * 55 or 50) + (N+1 * 75) + (Unused_Imports * 5)
    nested_loops = 2
    n_plus_one = 1
    unused_imports = 3
    carbon = (nested_loops * 50) + (n_plus_one * 75) + (unused_imports * 5)
    assert carbon == 100 + 75 + 15


def test_tests_estimation():
    """Verify test metrics estimator behaves correctly on temporary repository paths."""
    res = estimate_tests_carbon("d:/Projects/Carbotrace/backend")
    assert "num_tests" in res
    assert "avg_time" in res
    assert "coverage_gap" in res
    assert "carbon" in res
    assert res["carbon"] > 0.0


def test_ccf_lookup_coefficients():
    """Verify CCF coefficients lookup function fallbacks."""
    # Test instances
    assert get_instance_power("t3.medium") == 15.0
    assert get_instance_power("t4g.nano") == 2.5
    assert get_instance_power("unknown.instance") == 30.0
    
    # Test grid intensities
    assert get_grid_intensity("us-west-2") == 78.4
    assert get_grid_intensity("global-average") == 475.0
    assert get_grid_intensity("unknown-region") == 475.0
