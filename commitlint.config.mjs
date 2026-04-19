// Conventional Commits config
// https://www.conventionalcommits.org
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // docs only
        'style', // formatting, no code change
        'refactor', // refactor without behavior change
        'perf', // perf improvement
        'test', // tests
        'build', // build system / deps
        'ci', // CI config
        'chore', // tooling, maintenance
        'revert', // revert previous commit
      ],
    ],
    'subject-case': [0], // allow any case for subject (for Russian commits)
    'body-max-line-length': [0], // don't enforce — long lines in body are OK
    'footer-max-line-length': [0],
  },
};
