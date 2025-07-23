function transformPlayerStatisticsToGameWithStats(playerStatistics) {
    return playerStatistics.map((playerStatistic) => {
                const game = playerStatistic.game;
                return {
                    gameId: game.gameId,
                    date: game.date,
                    arena: game.arena,
                    city: game.city,
                    state: game.state,
                    homeTeam: {
                        id: game.homeTeamId,
                        logo: game.homeTeamLogo,
                        points: game.homeTeamPoints,
                    },
                    awayTeam: {
                        id: game.awayTeamId,
                        logo: game.awayTeamLogo,
                        points: game.awayTeamPoints,
                    },
                    playerStats: {
                        points: playerStatistic.points,
                        position: playerStatistic.position,
                        minPlayed: playerStatistic.minPlayed,
                        fgm: playerStatistic.fgm,
                        fga: playerStatistic.fga,
                        ftm: playerStatistic.ftm,
                        fta: playerStatistic.fta,
                        ftp: playerStatistic.ftp,
                        tpm: playerStatistic.tpm,
                        tpa: playerStatistic.tpa,
                        tpp: playerStatistic.tpp,
                        offReb: playerStatistic.offReb,
                        defReb: playerStatistic.defReb,
                        totReb: playerStatistic.totReb,
                        assists: playerStatistic.assists,
                        personalFouls: playerStatistic.personalFouls,
                        steals: playerStatistic.steals,
                        turnovers: playerStatistic.turnovers,
                        blocks: playerStatistic.blocks,
                        plusMinus: playerStatistic.plusMinus,
                        comment: playerStatistic.comment,
                    }
                }
            })
}

module.exports = {transformPlayerStatisticsToGameWithStats};