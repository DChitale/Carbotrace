import { GitFork, Cpu, ShieldCheck } from '@phosphor-icons/react';

export function WorkflowSteps() {
  const steps = [
    {
      num: '01',
      icon: GitFork,
      title: 'Zero-Config Repository Scan',
      desc: 'Simply paste any public GitHub repository URL or connect your private account. No intrusive SDK installations or production agent daemons required.',
    },
    {
      num: '02',
      icon: Cpu,
      title: '3-Layer Carbon Auditing',
      desc: 'Carbotrace parses the AST syntax tree for nested loops, evaluates GitHub Actions build minutes and layer caching, and cross-references datacenter grid factors.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Automated CI/CD Merge Gates',
      desc: 'Add the official Carbotrace GitHub Action to your repository. Catch carbon increases on pull requests and enforce eco-thresholds before merging into production.',
    },
  ];

  return (
    <section className="workflow-steps-section" aria-label="How Carbotrace works">
      <div className="section-header-centered">
        <h2 className="section-title-large">Seamless developer workflow</h2>
        <p className="section-desc">
          Designed to fit cleanly into existing pull request review rituals without adding friction to feature velocity.
        </p>
      </div>

      <div className="workflow-steps-grid">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="workflow-step-card">
              <div className="step-card-top">
                <span className="step-number">{s.num}</span>
                <div className="step-icon-bubble">
                  <Icon size={20} weight="bold" />
                </div>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
