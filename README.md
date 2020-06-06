# CoreSkills test runner action

This action runs tests and submits the results to CoreSkills.

## Inputs

### `access-key`

**Required** Your CoreSkills access key.

## Outputs

### `summary`

The test result summary

## Example usage

uses: actions/coreskills-test-runner@v1
with:
  access-key: ${{ secrets.CORESKILLS_ACCESS_KEY }}