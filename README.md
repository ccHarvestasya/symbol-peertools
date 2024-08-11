symbol-peertools
=================

Symbol Peer Node Tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/symbol-peertools.svg)](https://npmjs.org/package/symbol-peertools)
[![Downloads/week](https://img.shields.io/npm/dw/symbol-peertools.svg)](https://npmjs.org/package/symbol-peertools)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g symbol-peertools
$ symbol-peertools COMMAND
running command...
$ symbol-peertools (--version)
symbol-peertools/0.0.2 win32-x64 node-v20.16.0
$ symbol-peertools --help [COMMAND]
USAGE
  $ symbol-peertools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`symbol-peertools certGen`](#symbol-peertools-certgen)
* [`symbol-peertools certInfo`](#symbol-peertools-certinfo)
* [`symbol-peertools certRenew`](#symbol-peertools-certrenew)
* [`symbol-peertools chainInfo`](#symbol-peertools-chaininfo)
* [`symbol-peertools help [COMMAND]`](#symbol-peertools-help-command)
* [`symbol-peertools nodeDiagnosticCounters`](#symbol-peertools-nodediagnosticcounters)
* [`symbol-peertools nodeInfo`](#symbol-peertools-nodeinfo)
* [`symbol-peertools nodePeers`](#symbol-peertools-nodepeers)
* [`symbol-peertools nodeTime`](#symbol-peertools-nodetime)
* [`symbol-peertools nodeUnlockedAccount`](#symbol-peertools-nodeunlockedaccount)
* [`symbol-peertools rest CMD`](#symbol-peertools-rest-cmd)
* [`symbol-peertools watcher CMD`](#symbol-peertools-watcher-cmd)
* [`symbol-peertools wizard`](#symbol-peertools-wizard)

## `symbol-peertools certGen`

Generate Symbol node certificate.

```
USAGE
  $ symbol-peertools certGen [--cadays <value>] [--caname <value>] [--certdir <value>] [--force] [--nodedays
    <value>] [--nodename <value>] [--privatekeys <value>]

FLAGS
  --cadays=<value>       [default: 7300] CA certificate days
  --caname=<value>       [default: Simple Symbol CA] CA Name
  --certdir=<value>      [default: ./cert] Certificate output directory
  --force                Overwrite certificate output directory
  --nodedays=<value>     [default: 375] Node certificate days
  --nodename=<value>     [default: Simple Symbol Node] Node Name
  --privatekeys=<value>  [default: ./privatekeys.yaml] Encrypted privatekeys file save path

DESCRIPTION
  Generate Symbol node certificate.

EXAMPLES
  $ symbol-peertools certGen --caname "Test CA" --nodename "Test Node"
```

_See code: [src/commands/certGen/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/certGen/index.ts)_

## `symbol-peertools certInfo`

Display Symbol node certificate information.

```
USAGE
  $ symbol-peertools certInfo [--certdir <value>]

FLAGS
  --certdir=<value>  [default: ./cert] Certificate directory

DESCRIPTION
  Display Symbol node certificate information.

EXAMPLES
  $ symbol-peertools certInfo
```

_See code: [src/commands/certInfo/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/certInfo/index.ts)_

## `symbol-peertools certRenew`

Renew Symbol node certificate.

```
USAGE
  $ symbol-peertools certRenew [--cadays <value>] [--certdir <value>] [--nodedays <value>] [--privatekeys
    <value>]

FLAGS
  --cadays=<value>       [default: 7300] CA certificate days
  --certdir=<value>      [default: ./cert] Certificate directory
  --nodedays=<value>     [default: 375] Node certificate days
  --privatekeys=<value>  [default: ./privatekeys.yaml] Encrypted privatekeys file save path

DESCRIPTION
  Renew Symbol node certificate.

EXAMPLES
  $ symbol-peertools certRenew
```

_See code: [src/commands/certRenew/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/certRenew/index.ts)_

## `symbol-peertools chainInfo`

Display the same results as /chain/info for API nodes.

```
USAGE
  $ symbol-peertools chainInfo [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display the same results as /chain/info for API nodes.

EXAMPLES
  $ symbol-peertools chainInfo
```

_See code: [src/commands/chainInfo/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/chainInfo/index.ts)_

## `symbol-peertools help [COMMAND]`

Display help for symbol-peertools.

```
USAGE
  $ symbol-peertools help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for symbol-peertools.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.8/src/commands/help.ts)_

## `symbol-peertools nodeDiagnosticCounters`

Display diagnostic counters for the Symbol node.(IP required for trustedHosts)

```
USAGE
  $ symbol-peertools nodeDiagnosticCounters [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display diagnostic counters for the Symbol node.(IP required for trustedHosts)

EXAMPLES
  $ symbol-peertools nodeDiagnosticCounters
```

_See code: [src/commands/nodeDiagnosticCounters/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/nodeDiagnosticCounters/index.ts)_

## `symbol-peertools nodeInfo`

Display the same results as /node/info for API nodes.

```
USAGE
  $ symbol-peertools nodeInfo [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display the same results as /node/info for API nodes.

EXAMPLES
  $ symbol-peertools nodeInfo
```

_See code: [src/commands/nodeInfo/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/nodeInfo/index.ts)_

## `symbol-peertools nodePeers`

Display the same results as /node/peers for API nodes.

```
USAGE
  $ symbol-peertools nodePeers [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display the same results as /node/peers for API nodes.

EXAMPLES
  $ symbol-peertools nodePeers
```

_See code: [src/commands/nodePeers/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/nodePeers/index.ts)_

## `symbol-peertools nodeTime`

Display the same results as /node/time for API nodes.

```
USAGE
  $ symbol-peertools nodeTime [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display the same results as /node/time for API nodes.

EXAMPLES
  $ symbol-peertools nodeTime
```

_See code: [src/commands/nodeTime/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/nodeTime/index.ts)_

## `symbol-peertools nodeUnlockedAccount`

Display the same results as /node/unlockedaccount for API nodes.(IP required for trustedHosts)

```
USAGE
  $ symbol-peertools nodeUnlockedAccount [-p <value>] [-h <value>] [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.
  -h, --host=<value>            [default: 127.0.0.1] Host of Symbol node to access.
  -p, --port=<value>            [default: 7900] Port of symbol node to be accessed.

DESCRIPTION
  Display the same results as /node/unlockedaccount for API nodes.(IP required for trustedHosts)

EXAMPLES
  $ symbol-peertools nodeUnlockedAccount
```

_See code: [src/commands/nodeUnlockedAccount/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/nodeUnlockedAccount/index.ts)_

## `symbol-peertools rest CMD`

REST for peer node.

```
USAGE
  $ symbol-peertools rest CMD [-p <value>]

ARGUMENTS
  CMD  REST Server Start or Stop

FLAGS
  -p, --port=<value>  [default: 3000] listen port

DESCRIPTION
  REST for peer node.

EXAMPLES
  $ symbol-peertools rest start

  $ symbol-peertools rest start -p 3001

  $ symbol-peertools rest stop
```

_See code: [src/commands/rest/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/rest/index.ts)_

## `symbol-peertools watcher CMD`

Monitor Symbol node activity.

```
USAGE
  $ symbol-peertools watcher CMD

ARGUMENTS
  CMD  Monitor Symbol node activity Start or Stop.

DESCRIPTION
  Monitor Symbol node activity.

EXAMPLES
  $ symbol-peertools watcher start

  $ symbol-peertools watcher stop
```

_See code: [src/commands/watcher/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/watcher/index.ts)_

## `symbol-peertools wizard`

Wizard for generating Symbol certificate.

```
USAGE
  $ symbol-peertools wizard [-c <value>]

FLAGS
  -c, --configFilePath=<value>  [default: ./config.json] Config file path.

DESCRIPTION
  Wizard for generating Symbol certificate.

EXAMPLES
  $ symbol-peertools wizard wizard
```

_See code: [src/commands/wizard/index.ts](https://github.com/ccHarvestasya/symbol-peertools/blob/v0.0.2/src/commands/wizard/index.ts)_
<!-- commandsstop -->
