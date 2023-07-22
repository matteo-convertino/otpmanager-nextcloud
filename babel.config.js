// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later
const babelConfig = require('@nextcloud/babel-config')

// module.exports = babelConfig
module.exports = {
    presets:[
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}

