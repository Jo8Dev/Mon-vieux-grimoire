function getBookByRating(list) {
    return list
        .sort((a, b) => b.averageRating - a.averageRating) // Trier les notes par ordre décroissant
        .slice(0, 3) // Récupérer les 3 premiers objets
}

module.exports = { getBookByRating }